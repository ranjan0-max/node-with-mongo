const Enquiry = require("../Database/Models/Sales/enquiry.model");
const Quotation = require("../Database/Models/Sales/quotation.model");
const Lead = require("../Database/Models/Sales/lead.model");
const FirstMilePickup = require("../Database/Models/FirstMilePickup.model");
const Palet = require("../Database/Models/pallet.model");
const Booking = require("../Database/Models/booking.model");
const Customer = require("../Database/Models/customer.model");
const DateTime = require("../Helpers/dateTime.helper");
const DB = require("../Helpers/crud.helper");
const ONE = 1;
const TWO = 2;
const ZERO = 0;
const HIFEN = "-";
const BLANK = "";
const STR_ONE = "1";
const LTS = "ENQ";
const QUO = "QUO";
const LEAD = "LEAD";
const BOOK = "BOOK";
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
        let bookingNumber = BOOK + HIFEN + date + HIFEN + STR_ONE;
        resolve(bookingNumber);
      } else {
        let orderNumber = booking[booking.length - ONE].bookingNumber;
        let bookingNumberArray = orderNumber.split(HIFEN);
        if (date == bookingNumberArray[ONE]) {
          bookingNumberArray[TWO] = Number(bookingNumberArray[TWO]) + ONE;
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

async function generatePalletNumber() {
  return new Promise(async (resolve, reject) => {
    try {
      const pallets = await DB.findDetails(Palet);
      if (pallets.length === 0) {
        let palletNo = "PLT-0000001"; // Initial pre-booking number
        resolve(palletNo);
      } else {
        let palletNo = pallets[pallets.length - 1].palletNumber; // Assuming leadNumber is the property name for the pre-booking number in the database
        let palletNoArray = palletNo.split("-");
        let numericPart = Number(palletNoArray[1]) + 1;
        let paddedNumericPart = String(numericPart).padStart(7, "0");
        let newPalletNo = `PLT-${paddedNumericPart}`;
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

module.exports = {
  generateEnquiryNumber,
  generateQuotationNumber,
  generateLeadNumber,
  generatePreBooking,
  generateBookingNumber,
  generatePalletNumber,
  customerCode,
};
