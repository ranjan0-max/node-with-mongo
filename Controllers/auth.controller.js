const Response = require("../Helpers/response.helper");
const { IST } = require("../Helpers/dateTime.helper");
const Device = require("../Database/Models/Device.model");
const { generateCustomError } = require("../Helpers/error.helper");
const AuthHelper = require("../Helpers/auth.helper");
const DB = require("../Helpers/crud.helper");
const User = require("../Database/Models/user.model");
const Driver = require("../Database/Models/driver.model");
const Role = require("../Database/Models/role.model");
const NumberGenrator = require("../Helpers/numberGenerator.helper");
const { sendOTPMsg91, verifyOTPMsg91 } = require("../Helpers/otp.helper");
const Logger = require("../Helpers/logger");
const { handleSocketCallOn } = require("../Controllers/socket.controller");
const controllerName = "auth.controller.js";

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  APP_NAME,
} = process.env;

/**
 * @description Tries to register the user with provided body
 * @params data {Object} test
 * @returns Express res object with the success/failure and data
 */
async function register(req, res, next) {
  try {
    // unique email check
    await DB.isUnique(User, { email: req.body.email });

    const role = await DB.read(Role, { role: "SUPER_ADMIN" });
    // hash password
    const passwordHash = await AuthHelper.generateHash(req.body.password);

    // create user
    let createdUser = await DB.create(User, {
      email: req.body?.email || null,
      phone: req.body?.phone || null,
      name: req.body.name || req.body.username,
      password: passwordHash,
      device_token: req.body.token || null,
      role: [role[0].id],
      created_at: IST("date"),
      updated_at: IST("date"),
    });
    if (!createdUser instanceof Array) createdUser = [{ ...createdUser }];

    const accessToken = await AuthHelper.generateToken(
      {
        id: createdUser[0]._id,
        role: createdUser[0].role.map((item) => item._id),
        activeStatus: createdUser[0].activeStatus,
      },
      ACCESS_TOKEN_EXPIRY,
      ACCESS_TOKEN_SECRET
    );

    const refreshToken = await AuthHelper.generateToken(
      {
        id: createdUser[0]._id,
        role: createdUser[0].role.map((item) => item._id),
        activeStatus: createdUser[0].activeStatus,
      },
      REFRESH_TOKEN_EXPIRY,
      REFRESH_TOKEN_SECRET
    );

    res.cookie(APP_NAME, JSON.stringify({ refreshToken }), {
      secure: true,
      httpOnly: true,
      expires: IST("date", 30, "days"),
    });

    Response.success(res, {
      data: [
        {
          accessToken: accessToken,
          refreshToken: refreshToken,
          name: createdUser[0].name,
          email: createdUser[0].email || null,
          phone: createdUser[0].phone || null,
          id: createdUser[0]._id,
        },
      ],
    });

    await DB.update(User, {
      query: { _id: createdUser[0]._id },
      data: {
        activeStatus: true,
        refresh_token: refreshToken,
        updated_at: IST("date"),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @description Tries to login the user with provided body
 * @param req {object} Express req object
 * @param res {object} Express res object
 * @returns Express res object with the success/failure and data
 */
const login = async (req, res, next) => {
  try {
    let query = {};
    if (req.body?.email) query.email = req.body.email;
    else if (req.body?.phone) query.phone = req.body.phone;
    else await generateCustomError("BAD REQUEST", "bad_request", 400);

    const user = await DB.population(User, {
      queryString: query,
      popString: "role",
      popExclude: { updated_at: 0, role_active: 0, __v: 0, created_at: 0 },
    });

    if (!user.length)
      await generateCustomError(
        "Please register and try again !",
        "user_not_found",
        401,
        "clientUnautorized"
      );
    if (user[0]?.is_deleted)
      await generateCustomError("Account Blocked !", "account_blocked", 400);
    // if (!user[0]?.activeStatus)
    //   await generateCustomError(
    //     "Account Not Active !",
    //     "account_deactive",
    //     400
    //   );

    await AuthHelper.compareHash(req.body.password, user[0].password);
    delete user[0].password;
    delete user[0].is_deleted;
    delete user[0].refresh_token;

    const accessToken = await AuthHelper.generateToken(
      {
        id: user[0].id,
        role: user[0].role.map((item) => item._id),
        activeStatus: user[0].activeStatus,
      },
      ACCESS_TOKEN_EXPIRY,
      ACCESS_TOKEN_SECRET
    );

    // eslint-disable-next-line max-len
    const refreshToken = await AuthHelper.generateToken(
      {
        id: user[0].id,
        role: user[0].role.map((item) => item._id),
        activeStatus: user[0].activeStatus,
      },
      REFRESH_TOKEN_EXPIRY,
      REFRESH_TOKEN_SECRET
    );

    res.cookie(APP_NAME, JSON.stringify({ refreshToken }), {
      secure: true,
      httpOnly: true,
      expires: IST("date", 7, "days"),
      sameSite: "none",
    });

    Response.success(res, {
      data: {
        accessToken: accessToken,
        user: { ...user[0] },
        refresh_token: refreshToken,
        device_token: req.body.token,
        date: IST(),
      },
      message: "Logged-In SuccessFully",
    });

    await DB.update(User, {
      query: { _id: user[0].id },
      data: {
        device_token: req.body.token,
        refresh_token: refreshToken,
        updated_at: IST("date"),
      },
    });
  } catch (error) {
    Logger.error(error.message + "at login function " + controllerName);
    return Response.error(res, {
      data: [],
      message: "Something Went Wrong",
    });
  }
};

/**
 * @description API For Mobile Login
 * @param model mongoose User model && Device
 * @param data string: Request.body
 * @returns object: { success: boolean, error: boolean || error }
 */

const mobileLogin = async (req, res, next) => {
  try {
    let query = {};
    if (req.body?.email) query.email = req.body.email;
    else await generateCustomError("BAD REQUEST", "bad_request", 400);

    const user = await DB.population(User, {
      queryString: query,
      popString: "role",
      popExclude: { updated_at: 0, role_active: 0, __v: 0, created_at: 0 },
    });

    if (!user.length)
      await generateCustomError(
        "Please register and try again !",
        "user_not_found",
        401,
        "clientUnautorized"
      );
    if (user[0]?.is_deleted)
      await generateCustomError("Account Blocked !", "account_blocked", 400);

    await AuthHelper.compareHash(req.body.password, user[0].password);
    delete user[0].password;
    delete user[0].is_deleted;
    delete user[0].refresh_token;

    const accessToken = await AuthHelper.generateToken(
      {
        id: user[0].id,
        role: user[0].role.map((item) => item._id),
        activeStatus: user[0].activeStatus,
      },
      ACCESS_TOKEN_EXPIRY,
      ACCESS_TOKEN_SECRET
    );

    // eslint-disable-next-line max-len
    const refreshToken = await AuthHelper.generateToken(
      {
        id: user[0].id,
        role: user[0].role.map((item) => item._id),
        activeStatus: user[0].activeStatus,
      },
      REFRESH_TOKEN_EXPIRY,
      REFRESH_TOKEN_SECRET
    );

    if (user[0].role[0].role === "WAREHOUSE_EXECUTIVE") {
      const deviceQuery = {
        deviceId: req.body.deviceId,
      };
      // const deviceResponse = await Device.findOne(deviceQuery);
      const deviceResponse = await DB.readOne(Device, deviceQuery);
      if (deviceResponse) {
        if (deviceResponse.mappedUser === user[0].id) {
          return Response.success(res, {
            data: {
              accessToken: accessToken,
              user: {
                ...user[0],
                deviceId: req.body.deviceId,
                deviceName: deviceResponse.deviceName,
              },
              refresh_token: refreshToken,
              device_token: deviceResponse.device_token,
              siteId: deviceResponse.siteId,
              date: IST(),
            },
            message: "Logged-In SuccessFully",
          });
        } else {
          // checking the site Id in user siteid array
          let haveSite = false;
          user[0].siteId.forEach((site) => {
            if (site.toString() === deviceResponse.siteId.toString()) {
              haveSite = true;
            }
          });

          if (haveSite) {
            await DB.updateOne(Device, {
              query: {
                deviceName: deviceResponse.deviceName,
                deviceId: deviceResponse.deviceId,
              },
              data: {
                mappedUser: user[0].id,
              },
            });

            return Response.success(res, {
              data: {
                accessToken: accessToken,
                user: {
                  ...user[0],
                  deviceId: req.body.deviceId,
                  deviceName: deviceResponse.deviceName,
                },
                refresh_token: refreshToken,
                device_token: deviceResponse.device_token,
                siteId: deviceResponse.siteId,
                date: IST(),
              },
              message: "Logged-In SuccessFully",
            });
          } else {
            return Response.badRequest(res, {
              data: [],
              message: "User Is From Different Site",
            });
          }
        }
      } else {
        const deviceData = {
          deviceId: req.body.deviceId,
          siteId: user[0].siteId[0],
          deviceName: await NumberGenrator.deviceName(),
          device_token: req.body.token,
          mappedUser: user[0].id,
          active: true,
        };

        await DB.create(Device, deviceData);
        return Response.success(res, {
          data: {
            accessToken: accessToken,
            user: {
              ...user[0],
              deviceId: req.body.deviceId,
              deviceName: deviceData.deviceName,
            },
            refresh_token: refreshToken,
            device_token: req.body.token,
            siteId: deviceData.siteId,
            date: IST(),
          },
          message: "New device added and Logged-In SuccessFully",
        });
      }
    } else {
      await DB.update(User, {
        query: { _id: user[0].id },
        data: {
          device_token: req.body.token,
          refresh_token: refreshToken,
          updated_at: IST("date"),
        },
      });

      const newKeyName = "id";

      const userData = {
        ...user[0],
        [newKeyName]: user[0].userId || user[0].id,
      };

      return Response.success(res, {
        data: {
          accessToken: accessToken,
          user: { ...userData },
          refresh_token: refreshToken,
          device_token: req.body.token,
          date: IST(),
        },
        message: "Logged-In SuccessFully",
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      return Response.badRequest(res, {
        data: [],
        message: "Device Is Already Mapped With Another User" + error.message,
      });
    }
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await DB.population(User, {
      queryString: { _id: req.query.auth_user_id },
      popString: "role",
      queryExclude: {
        password: 0,
        is_deleted: 0,
        refresh_token: 0,
        created_at: 0,
      },
      popExclude: {
        updated_at: 0,
        role_active: 0,
        __v: 0,
        created_at: 0,
      },
    });
    if (!user.length)
      await generateCustomError(
        "Please register and try again !",
        "user_not_found",
        400
      );
    if (user[0]?.is_deleted)
      await generateCustomError("Account Blocked !", "account_blocked", 400);

    Response.success(res, {
      data: {
        user: user[0],
        date: IST(),
      },
      message: "Logged-In User Data Found",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Tries to login the user with provided body
 * @param req {Object} Express req object
 * @param res {Object} Express res object
 * @returns Express res object with the success/failure and generated token
 */
const generateTokens = async (req, res, next) => {
  try {
    let token = JSON.parse(req.cookies[APP_NAME]);
    token = token?.refreshToken;

    if (!token) {
      return Response.unauthorized(res, {
        data: [],
        message: "Invalid data or data missing",
      });
    }

    const verify = await AuthHelper.verifyToken(token, REFRESH_TOKEN_SECRET);

    const user = await DB.read(User, {
      _id: verify?.id,
      refresh_token: token,
      is_deleted: false,
    });

    if (!user.length) {
      return Response.unauthorized(res, {
        data: [],
        message: "Invalid Token Or User Blocked",
      });
    }

    const userData = {
      id: user[0]._id || user[0].id,
      name: user[0]?.name,
      email: user[0]?.email,
      role: user[0]?.role,
      image: user[0]?.image,
    };

    const accessToken = await AuthHelper.generateToken(
      userData,
      ACCESS_TOKEN_EXPIRY,
      ACCESS_TOKEN_SECRET
    );

    if (!accessToken) {
      return Response.badRequest(res, {
        data: [],
        message: "Unable to generate access token",
      });
    }
    return Response.success(res, { data: [{ accessToken }] });
  } catch (error) {
    return Response.error(res, {
      data: [],
      message: "Something Went Wrong",
    });
  }
};
/**
 * @description Tries to Logout the user with provided Req Data
 * @param req {Object} Express req object
 * @param res {Object} Express res object
 * @returns Express res object with the success/failure and generated token
 */
const logout = async (req, res, next) => {
  try {
    const authUserId = req.query.auth_user_id;
    // Check if auth_user_id is provided
    if (!authUserId) {
      return Response.error(res, {
        message: "auth_user_id is required.",
        statusCode: 400,
      });
    }

    // Check if the user exists (you may need to implement this function)
    if (!authUserId) {
      return Response.error(res, {
        message: "User not found.",
        statusCode: 404,
      });
    }

    // Perform the logout actions
    await DB.update(User, {
      query: { _id: authUserId },
      data: {
        refresh_token: "",
        device_token: "",
        active_status: false,
        updated_at: IST("date"),
      },
    });

    res.clearCookie(APP_NAME);
    return Response.success(res, { message: "User logged out!" });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

const generateOtp = async (phoneNumber) => {
  try {
    const dummyNumber = ["+91 11111111", "+91 2222222222", "+91 3333333333"];
    if (dummyNumber.includes(phoneNumber)) {
      return "message send";
    } else {
      const response = await sendOTPMsg91(phoneNumber);
      return response;
    }
  } catch (error) {
    Logger.error(error.message + "at generateOtp function " + controllerName);
    return "Otp Not Send";
  }
};

// ----------------------------- get driver info for login --------------------------

const getDriverInfo = async (req, res) => {
  try {
    const dummyNumber = ["+91 1111111111", "+91 2222222222", "+91 3333333333"];
    const phoneNumber = `${req.body.countryPhoneCode} ${req.body.phoneNumber}`;
    if (dummyNumber.includes(phoneNumber)) {
      return Response.success(res, {
        data: { type: 10 },
        message: "Dummy Driver",
      });
    }
    const driverInfo = await DB.readOne(Driver, { mobile: phoneNumber });
    if (driverInfo) {
      if (driverInfo.otpVerified) {
        return Response.success(res, {
          data: { type: 13, driverInfo: driverInfo },
          message: "Driver Phone Number Verifited",
        });
      } else {
        return Response.success(res, {
          data: { type: 10, driverInfo: driverInfo },
          message: "Driver Phone Number Not Verifited",
        });
      }
    }

    return Response.badRequest(res, {
      data: {},
      message: "Driver Not Registered",
    });
  } catch (error) {
    Logger.error(error.message + "at getDriverInfo function " + controllerName);
    return Response.badRequest(res, {
      data: [],
      message: error.message,
    });
  }
};

// ----------------------------- driver login --------------------------

const driverLoin = async (req, res) => {
  try {
    const phoneNumber = `${req.body.countryPhoneCode} ${req.body.phoneNumber}`;
    console.log(phoneNumber);
    const driverInfo = await DB.readOne(Driver, { mobile: phoneNumber });
    if (driverInfo) {
      if (driverInfo.otpVerified) {
        if (req.body.password) {
          await AuthHelper.compareHash(req.body.password, driverInfo.password);
          return Response.success(res, {
            data: driverInfo,
            message: "Driver LogIn Successfully",
          });
        } else {
          return Response.badRequest(res, {
            data: {},
            message: "Password Required",
          });
        }
      } else {
        const response = await generateOtp(phoneNumber);
        return Response.success(res, {
          data: response,
          message: "Otp Send Successfully",
        });
      }
    }
    return Response.badRequest(res, {
      data: {},
      message: "Driver Not Registered",
    });
  } catch (error) {
    Logger.error(error.message + "at verifyOtp function " + controllerName);
    return Response.badRequest(res, { data: {}, message: error.message });
  }
};

// ----------------------------- verify Otp --------------------------

const verifyOtp = async (req, res) => {
  try {
    const phoneNumber = `${req.body.countryPhoneCode} ${req.body.phoneNumber}`;
    const dummyNumber = ["+91 11111111", "+91 2222222222", "+91 3333333333"];
    console.log("entirng");
    if (dummyNumber.includes(phoneNumber)) {
      if (req.body.otp === "1234") {
        return Response.success(res, {
          data: {},
          message: "Driver Otp Verifited",
        });
      } else {
        return Response.badRequest(res, {
          data: {},
          message: "Otp Is Not Correct",
        });
      }
    } else {
      let phone = `${req.body.countryPhoneCode}${req.body.phoneNumber}`;
      const response = await verifyOTPMsg91(phone, req.body.otp);
      return Response.success(res, {
        data: response,
        message: "Driver Otp Verifited",
      });
    }
  } catch (error) {
    Logger.error(error.message + "at verifyOtp function " + controllerName);
    return Response.badRequest(res, {
      data: {},
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  generateTokens,
  getUser,
  mobileLogin,
  getDriverInfo,
  driverLoin,
  verifyOtp,
};
