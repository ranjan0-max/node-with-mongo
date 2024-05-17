const Response = require("../../Helpers/response.helper");
const Logger = require("../../Helpers/logger");
const HelperName = "checkQrCode.controller";

const bookingItemQrCodeChecker = (qrCodeNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bookingNumberArray = qrCodeNumber.split("-");
      const checkPktType = bookingNumberArray[2];
      const checkPktNumber = bookingNumberArray[3].replace(/[()]/g, "");
      if (
        !checkPktNumber.includes("/") ||
        !bookingNumberArray[3].includes("(") ||
        !bookingNumberArray[3].includes(")")
      ) {
        reject("Invalid Qr Code");
      } else {
        resolve(true);
      }
    } catch (error) {
      reject("Invalid Qr Code");
    }
  });
};

module.exports = {
  bookingItemQrCodeChecker,
};
