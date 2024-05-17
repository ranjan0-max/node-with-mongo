const Country = require("../Database/Models/country.model");
const Response = require("../Helpers/response.helper");
const Logger = require("../Helpers/logger");
const DateTime = require("../Helpers/dateTime.helper");
const DB = require("../Helpers/crud.helper");
const controllerName = "country.controller.js";

const createCountry = async (req, res, next) => {
  try {
    await DB.isUnique(Country, { name: req.body.name });
    const lastCountry_id = await Country.find().sort({ id: -1 }).limit(1);
    const data = {
      id: lastCountry_id[0].id + 1,
      name: req.body.name,
      code: req.body.code,
      phonecode: req.body.phonecode,
      country_active: req.body.country_active,
      created_at: DateTime.IST("date"),
      updated_at: DateTime.IST("date"),
    };
    //? creating data
    await DB.create(Country, data);
    return Response.success(res, { data: [data], message: "Country Added!" });
  } catch (error) {
    Logger.error(error.message + "at createCountry function " + controllerName);
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

const getAllCountry = async (req, res, next) => {
  try {
    const countries = await DB.findDetails(Country);
    return Response.success(res, {
      data: countries,
      count: countries.length,
      message: "Countries Found",
    });
  } catch (error) {
    Logger.error(error.message + "at getAllCountry function " + controllerName);
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

const getAllActiveCountry = async (req, res, next) => {
  try {
    const countries = await DB.findDetails(Country, { country_active: true });
    return Response.success(res, {
      data: countries,
      count: countries.length,
      message: "Countries Found",
    });
  } catch (error) {
    Logger.error(
      error.message + "at getAllActiveCountry function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

const removeCountry = async (req, res, next) => {
  try {
    if (!req.params.id) {
      let err = new Error("Invalid data !");
      err.name = "BAD_REQUEST";
      throw err;
    }
    await DB.remove(Country, { _id: req.params.id });
    return Response.success(res, {
      data: [],
      message: "Country removed !",
    });
  } catch (error) {
    Logger.error(error.message + "at removeCountry function " + controllerName);
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

const updateCountry = async (req, res, next) => {
  try {
    const myquery = { _id: req.params.id };

    const data = {
      ...req.body,
    };

    await DB.update(Country, { data, query: myquery });
    return Response.success(res, {
      data: [],
      message: "Country Updated !",
    });
  } catch (error) {
    Logger.error(error.message + "at updateCountry function " + controllerName);
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

module.exports = {
  createCountry,
  getAllCountry,
  removeCountry,
  updateCountry,
  getAllActiveCountry,
};
