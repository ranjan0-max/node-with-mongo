const DB = require("../Helpers/crud.helper");
const Response = require("../Helpers/response.helper");
const Logger = require("../Helpers/logger");
const Site = require("../Database/Models/site.model");
const Customer = require("../Database/Models/customer.model");
const Enquiry = require("../Database/Models/Sales/enquiry.model");
const Lead = require("../Database/Models/Sales/lead.model");
const FirstMilePickup = require("../Database/Models/FirstMilePickup.model");
const controllerName = "dashBoard.controller.js";

const getDashBoardData = async (req, res, next) => {
  try {
    const siteCount = await DB.getCount(Site);
    const customerCount = await DB.getCount(Customer);
    const customerApprovalCount = await DB.getCount(Customer, {
      is_approved: false,
    });
    const query = { priceApprove: false, enquiry_status: "PRICEREQUEST" };
    const priceApprovalEnquiryCount = await DB.getCount(Enquiry, query);
    const leadCount = await DB.getCount(Lead);
    const enquiryCount = await DB.getCount(Enquiry);
    const FirstMilePickupCount = await DB.getCount(FirstMilePickup);
    return Response.success(res, {
      data: {
        siteCount,
        customerCount,
        customerApprovalCount,
        priceApprovalEnquiryCount,
        leadCount,
        enquiryCount,
        FirstMilePickupCount,
      },
      message: "DashBoard Data Found",
    });
  } catch (error) {
    Logger.error(
      error.message + "at getDashBoardData function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

module.exports = {
  getDashBoardData,
};
