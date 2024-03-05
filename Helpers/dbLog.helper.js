const FmlStatusesLog = require("../Database/Models/FirstMilePickupStatus.model");
const BookingLog = require("../Database/Models/bookingLog.model");
const EnquiryStatusesLog = require("../Database/Models/Sales/enquiryLogs.model");
const QuotationLog = require("../Database/Models/Sales/quotationLog");
const DB = require("./crud.helper");

const makeBookingLog = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bookingLog = await DB.create(BookingLog, data);
      resolve(bookingLog);
    } catch (error) {
      reject(error);
    }
  });
};

const readBookingLog = async (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bookingLogs = await DB.findDetails(BookingLog, query);
      resolve(bookingLogs);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * @param {object} data
 * @param {objectId} data.fmlBookingNumber created FirstMilePickup  preBookingNo
 * @param {objectId} data.modifierName log created by
 * @param {Date} data.created_at Date of creation
 * @returns generated log/error
 */

const makeFMLStatuesLog = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fmlStatuesLog = await DB.create(FmlStatusesLog, data);
      resolve(fmlStatuesLog);
    } catch (error) {
      reject(error);
    }
  });
};

/*
 * @param {object} query query to fetch log
 * @param {object} sort sorting object
 * @returns logs
 */

const readFMlStatusesLog = async (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fmlLogs = await DB.population(FmlStatusesLog, {
        queryString: query,
        popString: "fieldExecutive",
      });

      resolve(fmlLogs);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * @param {object} data
 * @param {objectId} data.enquirynumber  created EnquiryLog  enquirynumber
 * @param {objectId} data.modifierName log created by
 * @param {Date} data.created_at Date of creation
 * @returns generated log/error
 */

const makeEnquiryStatusLog = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const enquiryStatuesLog = await DB.create(EnquiryStatusesLog, data);
      resolve(enquiryStatuesLog);
    } catch (error) {
      reject(error);
    }
  });
};

/*
 * @param {object} query query to fetch log
 * @param {object} sort sorting object
 * @returns logs
 */

const readEnquiryStatusesLog = async (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const enquiryLogs = await DB.findDetails(EnquiryStatusesLog, query);
      resolve(enquiryLogs);
    } catch (error) {
      reject(error);
    }
  });
};

const makeQuoationLog = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const quotationLog = await DB.create(QuotationLog, data);
      resolve(quotationLog);
    } catch (error) {
      reject(error);
    }
  });
};

const readQuotationLog = async (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const quotationLogs = await DB.findDetails(QuotationLog, query);
      resolve(quotationLogs);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  makeFMLStatuesLog,
  readFMlStatusesLog,
  makeEnquiryStatusLog,
  readEnquiryStatusesLog,
  makeBookingLog,
  readBookingLog,
  makeQuoationLog,
  readQuotationLog,
};
