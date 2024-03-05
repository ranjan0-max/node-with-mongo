const Response = require("../Helpers/response.helper");
const Booking = require("../Database/Models/booking.model");
const Logger = require("../Helpers/logger");
const DateTime = require("../Helpers/dateTime.helper");
const DB = require("../Helpers/crud.helper");
const NumberGenerator = require("../Helpers/numberGenerator.helper");
const controllerName = "booking.controller.js";
const { makeBookingLog, readBookingLog } = require("../Helpers/dbLog.helper");
const User = require("../Database/Models/user.model");
const QualityCheck = require("../Database/Models/qualityCheck.model");
const ConsignmentNoteMailTemplate = require("../Helpers/emailTemplates/consignmentNoteMailTemplate");
const SendEmail = require("../Helpers/email.helper");

/**
 * @description Create BOOKING ORDER
 * @param model mongoose Booking model && BookingStatus
 * @param data string: Request.body && Statues ["WAREHOUSE_IN"], preBookingNumber
 * @returns object: { success: boolean, error: boolean || error }
 */
const createBooking = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      bookingNumber: await NumberGenerator.generateBookingNumber(),
      status: "BOOKED",
      created_at: DateTime.IST("date"),
      updated_at: DateTime.IST("date"),
    };

    const modifierName = await DB.population(User, {
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

    await makeBookingLog({
      refNumber: data.bookingNumber,
      detailDescription: "Shiment Booked SuccessFully!",
      enquiryNumber: data?.enquiryNumber,
      preBookingNumber: data?.preBookingNumber,
      status: data.status,
      functionName: "createBooking",
      modifierName: modifierName[0].name ?? "ADMIN",
      created_at: DateTime.IST(),
      updated_at: DateTime.IST(),
    });

    await DB.create(Booking, data);

    return Response.success(res, { data: data, message: "Booking Added!" });
  } catch (error) {
    Logger.error(
      error.message + " at createBooking function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

/**
 * @description GET ALL BOOKING ORDER
 * @param model mongoose Booking model && BookingStatus
 * @param data string: Request.body && Statues ["WAREHOUSE_IN"], preBookingNumber
 * @returns object: { success: boolean, error: boolean || error }
 */

const getAllBooking = async (req, res, next) => {
  try {
    const bookings = await DB.aggregation(Booking, [
      {
        $lookup: {
          from: "customers",
          localField: "customerName",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "shipperName",
          foreignField: "_id",
          as: "shipper",
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "consigneeName",
          foreignField: "_id",
          as: "consignee",
        },
      },
    ]);
    return Response.success(res, { data: bookings });
  } catch (error) {
    Logger.error(
      error.message + " at getAllBooking function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

/**
 * @description Update BOOKING ORDER
 * @param model mongoose Booking model && BookingStatus makeBookingLog
 * @param data string: Request.body && Statues ["WAREHOUSE_IN"], preBookingNumber
 * @returns object: { success: boolean, error: boolean || error }
 */

const updateBooking = async (req, res, next) => {
  try {
    const myquery = { _id: req.params.id };
    const data = {
      ...req.body,
      updated_at: DateTime.IST("date"),
    };
    const modifierName = await DB.population(User, {
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

    await makeBookingLog({
      refNumber: data.bookingNumber,
      detailDescription: "Booking Updated SuccessFully!" + data.status,
      enquiryNumber: data?.enquiryNumber,
      preBookingNumber: data?.preBookingNumber,
      status: data.status,
      functionName: "createBooking",
      modifierName: modifierName[0].name ?? "ADMIN",
      created_at: DateTime.IST(),
      updated_at: DateTime.IST(),
    });
    await DB.update(Booking, { data, query: myquery });
    return Response.success(res, {
      data: [],
      message: "Booking Details Updated !",
    });
  } catch (error) {
    Logger.error(
      error.message + " at createBooking function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

const getBookingDetail = async (req, res) => {
  try {
    const myBookingQuery = { bookingNumber: req.params.id };
    const myRefQuery = { refNumber: req.params.id };
    let bookingDetail;
    bookingDetail = await DB.findDetails(Booking, myBookingQuery);
    if (!bookingDetail.length) {
      bookingDetail = await DB.findDetails(Booking, myRefQuery);
    }
    return Response.success(res, { data: bookingDetail });
  } catch (error) {
    Logger.error(
      error.message + " at getBookingDetail function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

const getBookingLog = async (req, res) => {
  try {
    const myRefQuery = { refNumber: req.params.id };
    const bookingLog = await readBookingLog(myRefQuery);
    return Response.success(res, {
      data: bookingLog,
      message: "Booking Details Updated !",
    });
  } catch (error) {
    Logger.error(
      error.message + " at getBookingLog function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

const getConsignmentNote = async (req, res) => {
  try {
    console.log("consignmentNotePdfDoc", req.body);
    const binaryData = Buffer.from(req.body.pdf.split(",")[1], "base64");
    console.log("req.body.bookingData", req.body);

    let attachment = {
      filename: `${req.body.consignementData.bookingNumber}.pdf`, // set the desired file name
      content: binaryData,
      encoding: "base64",
    };

    let emailData = {
      to: req.body.toEmail,
      cc: "vikas@coderootz.com",
      from: "vikas@coderootz.com",
      subject: "Consignment note",
      replyTo: "analytics@threelineshipping.com",
      attachments: [attachment],
      html: ConsignmentNoteMailTemplate.ConsignmentNoteMailTemplate(
        req.body.consignementData
      ),
    };
    try {
      await SendEmail.sendEmailWithNodemailer(req, res, emailData);
    } catch (error) {
      console.log(error);
    }
    return Response.success(res, {
      data: [],
      message: "mail send",
    });
  } catch (error) {
    Logger.error(
      error.message + " at getBookingLog function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getAllBooking,
  updateBooking,
  getBookingDetail,
  getBookingLog,
  getConsignmentNote,
};
