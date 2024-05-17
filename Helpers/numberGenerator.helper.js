const Enquiry = require("../Database/Models/Sales/enquiry.model");
const Quotation = require("../Database/Models/Sales/quotation.model");
const Lead = require("../Database/Models/Sales/lead.model");
const FirstMilePickup = require("../Database/Models/FirstMilePickup.model");
const Palet = require("../Database/Models/pallet.model");
const Booking = require("../Database/Models/booking.model");
const Customer = require("../Database/Models/customer.model");
const Device = require("../Database/Models/Device.model");
const LoadList = require("../Database/Models/loadList.model");
const ExportJob = require("../Database/Models/exportJob.model");
const ImportJob = require("../Database/Models/importJob.model");
const LmdOrder = require("../Database/Models/lmdOrders.model");
const FtlBooking = require("../Database/Models/ftlBooking.model");
const FtlExportJob = require("../Database/Models/ftlExportJob.model");
const Logger = require("../Helpers/logger");
const DateTime = require("../Helpers/dateTime.helper");
const DB = require("../Helpers/crud.helper");
const ONE = 1;
const TWO = 2;
const THREE = 3;
const ZERO = 0;
const HIFEN = "-";
const BLANK = "";
const STR_ONE = "1";
const LTS = "ENQ";
const QUO = "QUO";
const LEAD = "LEAD";
const TLS = "TLS";
const LDL = "LDL";
const JOB = "JOB";
const ORD = "ORD";
const controllerName = "numberGenerator.helper";
/**
 * Enquiry Number Random changes
 */

async function generateEnquiryNumber() {
  return new Promise(async (resolve, reject) => {
    try {
      let date = DateTime.IST("date").replaceAll(HIFEN, BLANK);
      const enquiry = await DB.findDetails(Enquiry);
      if (enquiry.length === ZERO) {
        let enquiryNumber = LTS + HIFEN + date + HIFEN + STR_ONE;
        resolve(enquiryNumber);
      } else {
        let orderNumber = enquiry[enquiry.length - ONE].enquiry_number;
        let enquiryNumberArray = orderNumber.split(HIFEN);
        if (date == enquiryNumberArray[ONE]) {
          enquiryNumberArray[TWO] = Number(enquiryNumberArray[TWO]) + ONE;
        } else {
          enquiryNumberArray[ONE] = date;
          enquiryNumberArray[TWO] = STR_ONE;
        }
        const enqueryNo = enquiryNumberArray.join(HIFEN);
        resolve(enqueryNo);
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function generateBookingNumber() {
  return new Promise(async (resolve, reject) => {
    try {
      let date = DateTime.IST("date").replaceAll(HIFEN, BLANK);
      const booking = await DB.findDetails(Booking);
      if (booking.length === ZERO) {
        let bookingNumber = TLS + HIFEN + date + HIFEN + STR_ONE;
        resolve(bookingNumber);
      } else {
        let orderNumber = booking[booking.length - ONE].bookingNumber;
        let bookingNumberArray = orderNumber.split(HIFEN);
        let bookingDate = bookingNumberArray[ONE];
        if (date == bookingDate) {
          let bookingNumber = bookingNumberArray[TWO];
          bookingNumberArray[TWO] = Number(bookingNumber) + ONE;
        } else {
          bookingNumberArray[ONE] = date;
          bookingNumberArray[TWO] = STR_ONE;
        }
        const bookingNo = bookingNumberArray.join(HIFEN);
        resolve(bookingNo);
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Quotation Number Random changes
 */
async function generateQuotationNumber() {
  return new Promise(async (resolve, reject) => {
    try {
      let date = DateTime.IST("date").replaceAll(HIFEN, BLANK);
      const quotation = await DB.findDetails(Quotation);

      if (quotation.length === ZERO) {
        let quotationNumber = QUO + HIFEN + date + HIFEN + STR_ONE;
        resolve(quotationNumber);
      } else {
        let orderNumber = quotation[quotation.length - ONE].quotationNumber;

        let quotationNumberArray = orderNumber.split(HIFEN);
        if (date == quotationNumberArray[ONE]) {
          quotationNumberArray[TWO] = Number(quotationNumberArray[TWO]) + ONE;
        } else {
          quotationNumberArray[ONE] = date;
          quotationNumberArray[TWO] = STR_ONE;
        }
        const QuotationNo = quotationNumberArray.join(HIFEN);

        resolve(QuotationNo);
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * LEAD Number Random changes
 */
async function generateLeadNumber() {
  return new Promise(async (resolve, reject) => {
    try {
      let date = DateTime.IST("date").replaceAll(HIFEN, BLANK);
      const lead = await DB.findDetails(Lead);

      if (lead.length === ZERO) {
        let leadNumber = LEAD + HIFEN + date + HIFEN + STR_ONE;
        resolve(leadNumber);
      } else {
        let orderNumber = lead[lead.length - ONE].leadNumber;
        let leadNumberArray = orderNumber.split(HIFEN);
        if (date == leadNumberArray[ONE]) {
          leadNumberArray[TWO] = Number(leadNumberArray[TWO]) + ONE;
        } else {
          leadNumberArray[ONE] = date;
          leadNumberArray[TWO] = STR_ONE;
        }
        const LeadNo = leadNumberArray.join(HIFEN);
        resolve(LeadNo);
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * PreBooking Number Random changes
 */
async function generatePreBooking() {
  return new Promise(async (resolve, reject) => {
    try {
      const preBooking = await DB.findDetails(FirstMilePickup);
      if (preBooking.length === 0) {
        let preBookingNo = "PB-0000001"; // Initial pre-booking number
        resolve(preBookingNo);
      } else {
        let orderNumber = preBooking[preBooking.length - 1].preBookingNo; // Assuming leadNumber is the property name for the pre-booking number in the database
        let preBookingNoArray = orderNumber.split("-");
        let numericPart = Number(preBookingNoArray[1]) + 1;
        let paddedNumericPart = String(numericPart).padStart(7, "0");
        let newPreBookingNo = `PB-${paddedNumericPart}`;
        resolve(newPreBookingNo);
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function generatePalletNumber(siteCode, siteId) {
  return new Promise(async (resolve, reject) => {
    try {
      const pallets = await DB.findDetails(Palet, { siteId });
      if (pallets.length === 0) {
        let palletNo = `PLT-${siteCode.toUpperCase()}-0000001`; // Initial pre-booking number
        resolve(palletNo);
      } else {
        let palletNo = pallets[pallets.length - 1].palletNumber; // Assuming leadNumber is the property name for the pre-booking number in the database
        let palletNoArray = palletNo.split("-");
        let numericPart = Number(palletNoArray[2]) + 1;
        let paddedNumericPart = String(numericPart).padStart(7, "0");
        let newPalletNo = `PLT-${siteCode.toUpperCase()}-${paddedNumericPart}`;
        resolve(newPalletNo);
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function customerCode() {
  return new Promise(async (resolve, reject) => {
    try {
      const customers = await DB.findDetails(Customer);
      if (customers.length === 0) {
        let customerNo = "C50000";
        resolve(customerNo);
      } else {
        let customerNo = customers[customers.length - 1].code;
        let customerNoArray = customerNo.split("C");
        let numericPart = Number(customerNoArray[1]) + 1;
        let newCustomerNo = `C${String(numericPart)}`;
        resolve(newCustomerNo);
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function deviceName() {
  return new Promise(async (resolve, reject) => {
    try {
      const DeviceList = await DB.findDetails(Device);
      if (DeviceList.length === 0) {
        let deviceName = "Device1";
        resolve(deviceName);
      } else {
        let tempDeviceName = DeviceList[DeviceList.length - 1].deviceName;
        let deviceNameArray = tempDeviceName.split("Device");
        let numericPart = Number(deviceNameArray[1]) + 1;
        let newDeviceName = `Device${String(numericPart)}`;
        resolve(newDeviceName);
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function generateLoadListNumber() {
  return new Promise(async (resolve, reject) => {
    try {
      let date = DateTime.IST("date").replaceAll(HIFEN, BLANK);
      const loadList = await DB.findDetails(LoadList);
      if (loadList.length === ZERO) {
        let newLoadListNumber = LDL + HIFEN + date + HIFEN + STR_ONE;
        resolve(newLoadListNumber);
      } else {
        let existingLoadListNumber =
          loadList[loadList.length - ONE].loadListNumber;
        let loadListNumberArray = existingLoadListNumber.split(HIFEN);
        if (date == loadListNumberArray[ONE]) {
          loadListNumberArray[TWO] = Number(loadListNumberArray[TWO]) + ONE;
        } else {
          loadListNumberArray[ONE] = date;
          loadListNumberArray[TWO] = STR_ONE;
        }
        const loadListNumber = loadListNumberArray.join(HIFEN);
        resolve(loadListNumber);
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function generateJobNumber(siteCode, jobType, siteId) {
  return new Promise(async (resolve, reject) => {
    try {
      let date = DateTime.IST("date").replaceAll(HIFEN, BLANK);
      let jobList = [];
      let type = "";
      if (jobType === "EXPORT") {
        type = "LTLEXP";
        jobList = await DB.findDetails(ExportJob, { siteId: siteId });
      } else if (jobType === "IMPORT") {
        type = "LTLIMP";
        jobList = await DB.findDetails(ImportJob, { siteId: siteId });
      } else if (jobType === "FTL EXPORT") {
        type = "FTLEXP";
        jobList = await DB.findDetails(FtlExportJob, { siteId: siteId });
      }
      // const jobList = await DB.findDetails(Job);
      if (jobList.length === ZERO) {
        let newJobNumber =
          `${type}${JOB}` +
          HIFEN +
          siteCode.toUpperCase() +
          HIFEN +
          date +
          HIFEN +
          STR_ONE;
        resolve(newJobNumber);
      } else {
        let existingJobNumber = jobList[jobList.length - ONE].jobNumber;
        let jobNumberArray = existingJobNumber.split(HIFEN);
        if (date == jobNumberArray[TWO]) {
          jobNumberArray[THREE] = Number(jobNumberArray[THREE]) + ONE;
        } else {
          jobNumberArray[TWO] = date;
          jobNumberArray[THREE] = STR_ONE;
        }
        const jobNumber = jobNumberArray.join(HIFEN);
        resolve(jobNumber);
      }
    } catch (error) {
      Logger.error(
        error.message + "at generateJobNumber function " + controllerName
      );
      reject(error);
    }
  });
}

async function generateOrderNumberForLmd(siteCode, siteId) {
  return new Promise(async (resolve, reject) => {
    try {
      let date = DateTime.IST("date").replaceAll(HIFEN, BLANK);
      const orderList = await DB.findDetails(LmdOrder, { siteId: siteId });
      if (orderList.length === ZERO) {
        let newOrderNumber =
          ORD + HIFEN + siteCode.toUpperCase() + HIFEN + date + HIFEN + STR_ONE;
        resolve(newOrderNumber);
      } else {
        let existingOrderNumber = orderList[orderList.length - ONE].orderNumber;
        let orderNumberArray = existingOrderNumber.split(HIFEN);
        if (date == orderNumberArray[TWO]) {
          orderNumberArray[THREE] = Number(orderNumberArray[THREE]) + ONE;
        } else {
          orderNumberArray[TWO] = date;
          orderNumberArray[THREE] = STR_ONE;
        }
        const orderNumber = orderNumberArray.join(HIFEN);
        resolve(orderNumber);
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function generateFtlBookingNumber() {
  return new Promise(async (resolve, reject) => {
    try {
      let date = DateTime.IST("date").replaceAll(HIFEN, BLANK);
      const ftlBooking = await DB.findDetails(FtlBooking);
      if (ftlBooking.length === ZERO) {
        let ftlBookingNumber = "FTLBK" + HIFEN + date + HIFEN + STR_ONE;
        resolve(ftlBookingNumber);
      } else {
        let orderNumber = ftlBooking[ftlBooking.length - ONE].bookingNumber;
        let ftlBookingNumberArray = orderNumber.split(HIFEN);
        let bookingDate = ftlBookingNumberArray[ONE];
        if (date == bookingDate) {
          let ftlBookingNumber = ftlBookingNumberArray[TWO];
          ftlBookingNumberArray[TWO] = Number(ftlBookingNumber) + ONE;
        } else {
          ftlBookingNumberArray[ONE] = date;
          ftlBookingNumberArray[TWO] = STR_ONE;
        }
        const ftlBookingNo = ftlBookingNumberArray.join(HIFEN);
        resolve(ftlBookingNo);
      }
    } catch (error) {
      Logger.error(
        error.message + "at generateFtlBookingNumber function " + controllerName
      );
      reject(error);
    }
  });
}

module.exports = {
  generateEnquiryNumber,
  generateQuotationNumber,
  generateLeadNumber,
  generatePreBooking,
  generateBookingNumber,
  generatePalletNumber,
  customerCode,
  deviceName,
  generateLoadListNumber,
  generateJobNumber,
  generateOrderNumberForLmd,
  generateFtlBookingNumber,
};
