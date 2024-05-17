const mongoose = require("mongoose");
const User = require("../Database/Models/user.model");
const Role = require("../Database/Models/role.model");
const Response = require("../Helpers/response.helper");
const Logger = require("../Helpers/logger");
const DateTime = require("../Helpers/dateTime.helper");
const DB = require("../Helpers/crud.helper");
const AuthHelper = require("../Helpers/auth.helper");
const MapSalemanagerToSaleman = require("../Database/Models/Sales/mapSalemanagerToSaleman");

const controllerName = "user.controller.js";

/**
 * @description Create User
 * @param model mongoose User model && Role
 * @param data string: Request.body
 * @returns object: { success: boolean, error: boolean || error }
 */
const createUser = async (req, res, next) => {
  try {
    // checking email is unique
    await DB.isUnique(User, { email: req.body.email });

    if (req.body.password) {
      const passwordHash = await AuthHelper.generateHash(req.body.password);
      // create user Data
      const data = {
        ...req.body,
        password: passwordHash,
        created_at: DateTime.IST("date"),
        updated_at: DateTime.IST("date"),
      };
      await DB.create(User, data);

      return Response.success(res, {
        data: data,
        message: "User Created SuccessFully",
      });
    } else {
      return Response.error(res, {
        data: [],
        message: "Password is required",
      });
    }
  } catch (error) {
    if (error.name === "NON_UNIQUE") {
      Logger.error(error.message + "at createUser function " + controllerName);
      return Response.error(res, {
        data: [],
        message: "Email already taken",
      });
    }
    Logger.error(error.message + "at createUser function " + controllerName);
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};
/**
 * @description Get Users
 * @param model mongoose User model && Role
 * @param data string: Request.body
 * @returns object: { success: boolean, error: boolean || error }
 */
const getAllUser = async (req, res, next) => {
  try {
    // const role = await Role.find({ role: ["CUSTOMER", "FIELD_EXECUTIVE"] });

    const roleNamesToInclude = ["CUSTOMER", "FIELD_EXECUTIVE", "SUPER_ADMIN"];
    const Users = await User.aggregate([
      {
        $lookup: {
          from: "countries",
          localField: "countryId",
          foreignField: "id",
          as: "country",
        },
      },
      {
        $lookup: {
          from: "sites",
          localField: "siteId",
          foreignField: "_id",
          as: "site",
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "divisionId",
          foreignField: "_id",
          as: "division",
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "roles",
        },
      },
      {
        $match: {
          "roles.role": {
            $nin: roleNamesToInclude, // for that not include Customer and Field Excutive
          },
        },
      },
    ]);

    if (Users.length > 0) {
      return Response.success(res, {
        data: Users,
        count: Users.length,
        message: "Users Found",
      });
    }
    return Response.success(res, {
      data: [],
      count: 0,
      message: "No Users Found",
    });
  } catch (error) {
    console.log(error);
    Logger.error(error.message + "at getAllUser function " + controllerName);
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

/**
 * @description Get Active inactive
 * @param model mongoose User model && Role
 * @param data string: Request.body
 * @returns object: { success: boolean, error: boolean || error }
 */
const getActiveUser = async (req, res, next) => {
  try {
    const users = await DB.aggregation(User, [
      { $match: { activeStatus: true } },
      {
        $lookup: {
          from: "countries",
          localField: "countryId",
          foreignField: "id",
          as: "country",
        },
      },
      {
        $lookup: {
          from: "sites",
          localField: "siteId",
          foreignField: "_id",
          as: "site",
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "divisionId",
          foreignField: "_id",
          as: "division",
        },
      },
    ]);
    if (users.length > 0) {
      return Response.success(res, {
        data: users,
        count: users.length,
        message: "Users found",
      });
    }

    return Response.success(res, {
      data: [],
      count: 0,
      message: "No users found",
    });
  } catch (error) {
    Logger.error(error.message + "at getActiveUser function " + controllerName);
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

// ------------------- get Active user by their role and site wise ------------------------------

const getActiveUserBySiteAndRole = async (req, res) => {
  try {
    const filter = req.query;
    const roles = await DB.findDetails(Role);
    let filterIdOfUser;
    if (filter.filterName === "SALE_MANAGER") {
      const saleManagerId = roles.find((data) => data.role === "SALE_MANAGER");
      filterIdOfUser = saleManagerId._id;
    } else if (filter.filterName === "SALEMAN") {
      const saleManId = roles.find((data) => data.role === "SALEMAN");
      filterIdOfUser = saleManId._id;
    } else if (filter.filterName === "WAREHOUSE_EXECUTIVE") {
      const wareHouseExecutiveId = roles.find(
        (data) => data.role === "WAREHOUSE_EXECUTIVE"
      );
      filterIdOfUser = wareHouseExecutiveId._id;
    }
    const query = {
      role: { $elemMatch: { $eq: filterIdOfUser } },
      siteId: { $elemMatch: { $eq: filter.siteId } },
      activeStatus: true,
    };

    const users = await DB.findDetails(User, query);

    return Response.success(res, {
      data: users,
      count: 0,
      message: "Data found",
    });
  } catch (error) {
    Logger.error(
      error.message + "at getActiveUserBySiteAndRole function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

// --------------------- get sales man by sale manager ----------------------------------------

const getSalesManBySaleManager = async (req, res) => {
  try {
    const salesManList = await DB.aggregation(MapSalemanagerToSaleman, [
      {
        $match: {
          saleManagerId: mongoose.Types.ObjectId(req.query.saleManagerId),
          siteId: mongoose.Types.ObjectId(req.query.siteId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "saleMan",
          foreignField: "_id",
          as: "salesMan",
        },
      },
    ]);

    return Response.success(res, {
      data: salesManList,
      count: 0,
      message: "Data found",
    });
  } catch (error) {
    Logger.error(
      error.message + "at getSalesManBySaleManager function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

/**
 * @description Get User Based on Id
 * @param model mongoose User model && Role
 * @param data string: Request.Params.Id
 * @returns object: { success: boolean, error: boolean || error }
 */
const getSingleUserData = async (req, res, next) => {
  try {
    const Users = await User.find({ _id: req.params.id });
    if (Users.length > 0) {
      return Response.success(res, {
        data: Users,
        count: Users.length,
        message: "Users Found",
      });
    }
    return Response.success(res, {
      data: [],
      count: 0,
      message: "No User Found",
    });
  } catch (error) {
    Logger.error(
      error.message + "at getSingleUserData function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

/**
 * @description Update User Based on Id
 * @param model mongoose User model && Role
 * @param data string: Request.Params.Id
 * @returns object: { success: boolean, error: boolean || error }
 */

const updateUser = async (req, res, next) => {
  try {
    const myquery = { _id: req.params.id };
    const data = { ...req.body };

    if (req.body.password) {
      data.password = await AuthHelper.generateHash(req.body.password);
    }

    await DB.update(User, { data, query: myquery });
    return Response.success(res, {
      data: data,
      message: "User Details Updated!",
    });
  } catch (error) {
    Logger.error(error.message + " at updateUser function " + controllerName);
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

/**
 * @description Get WareHouseApproval Users
 * @param model mongoose User model && Role
 * @param data string: Request.body
 * @returns object: { success: boolean, error: boolean || error }
 */
const getWareHouseApprovalUser = async (req, res, next) => {
  try {
    // Find role IDs for "WAREHOUSE_MANAGER" and "SUPERVISOR"
    const roles = await Role.find({
      role: { $in: ["WAREHOUSE_MANAGER", "SUPERVISOR"] },
    });
    const roleIds = roles.map((role) => role._id);

    // Find users with role IDs related to the "SUPERVISOR" and "SUPERVISOR" roles
    // const approvalUsers = await User.find(
    //   { role: { $in: roleIds } },
    //   { name: 1, email: 1 }
    // );

    const approvalUsers = await User.aggregate([
      { $match: { role: { $in: roleIds } } }, // Match documents with the desired roles
      {
        $project: {
          _id: 0, // Exclude the "_id" field
          id: "$_id", // Create a new field "id" with the value of "_id"
          name: 1, // Include the "name" field
          email: 1, // Include the "email" field
        },
      },
    ]);
    return Response.success(res, {
      data: approvalUsers,
      count: approvalUsers.length,
      message: "Approval User Found successfully",
    });
  } catch (error) {
    Logger.error(
      error.message + " at getWareHouseApprovalUser function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  getSingleUserData,
  getAllUser,
  updateUser,
  getActiveUser,
  getActiveUserBySiteAndRole,
  getWareHouseApprovalUser,
  getSalesManBySaleManager,
};
