const Enquiry = require("../Database/Models/Sales/enquiry.model");
const Response = require("../Helpers/response.helper");
const Logger = require("../Helpers/logger");
const DateTime = require("../Helpers/dateTime.helper");
const DB = require("../Helpers/crud.helper");
const Number = require("../Helpers/numberGenerator.helper");
const Quotation = require("../Database/Models/Sales/quotation.model");
const Lead = require("../Database/Models/Sales/lead.model");
const User = require("../Database/Models/user.model");
const MapSalemanagerToSaleman = require("../Database/Models/Sales/mapSalemanagerToSaleman");
const Segment = require("../Database/Models/segment.model");
const { uploadFile, getTempUrl, s3Delete } = require("../Helpers/s3Aws.helper");
const {
  makeEnquiryStatusLog,
  readEnquiryStatusesLog,
  makeQuoationLog,
} = require("../Helpers/dbLog.helper");

const controllerName = "sales.controller.js";
const ALL_SEGMENT = "ALL SEGMENT";
const { handleSocketCallOn } = require("../Controllers/socket.controller");

/////////////////***************************  ENQUIRY FUNCTIONS  ************************////////////////

/**
 * @description Create New Enquiry
 * @param model mongoose Enquiry model
 * @param Data string: request.body
 * @returns object: { success: boolean, error: boolean || error }
 */
const createEnquiry = async (request, response, next) => {
  try {
    // var attachmentFileName = null;
    // if (request.body.attachment) {
    //   attachmentFileName = await uploadFile(
    //     request.body.attachment,
    //     "EnquiryAttachment",
    //     "Attachment"
    //   );
    // }
    var enquiryStatus;
    if (request.body.selfApproval) {
      enquiryStatus = "APPROVED";
    } else if (request.body.approvalManager) {
      enquiryStatus = "PRICEREQUEST";
    } else {
      enquiryStatus = "ENQUIRY";
    }
    const data = {
      enquiry_number: await Number.generateEnquiryNumber(),
      ...request.body,
      enquiry_status: enquiryStatus,
      // attachment: attachmentFileName ? attachmentFileName : null,
      created_at: DateTime.IST("date"),
      updated_at: DateTime.IST("date"),
    };

    const modifierName = await DB.population(User, {
      queryString: { _id: request.query.auth_user_id },
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
    await makeEnquiryStatusLog({
      detailDescription: "Enquiry Created SuccessFully!",
      enquiryNumber: data.enquiry_number,
      status: data.enquiry_status,
      functionName: "createEnquiry",
      modifierName: modifierName[0].name ?? "ADMIN",
      created_at: DateTime.IST(),
      updated_at: DateTime.IST(),
    });
    await DB.create(Enquiry, data);

    return Response.success(response, {
      data: [data],
      message: "Enquiry Added !",
    });
  } catch (error) {
    Logger.error(error.message + "at createEnquiry function " + controllerName);
    return Response.error(response, {
      data: [],
      message: error.message,
    });
  }
};

/**
 * @description Get All Enquiry
 * @param model mongoose Enquiry model
 * @param Data string: request.body
 * @returns object: { success: boolean, error: boolean || error }
 */

const getAllEnquiry = async (request, response, next) => {
  try {
    const enquiry = await DB.findDetails(Enquiry, request.query);

    if (enquiry.length) {
      for (let i = 0; i < enquiry.length; i++) {
        for (let j = 0; j < enquiry[i].attachment.length; j++) {
          const link = await getTempUrl(enquiry[i].attachment[j].fileName);
          const fileType = enquiry[i].attachment[j].fileType;
          enquiry[i].attachment[j] = {
            ...enquiry[i].attachment[j],
            link,
            fileType: enquiry[i].attachment[j].fileType,
            fileName: enquiry[i].attachment[j].fileName,
          };
        }
      }

      return Response.success(response, {
        data: enquiry,
        count: enquiry.length,
        message: "Enquiries Found !",
      });
    } else {
      return Response.success(response, {
        data: [],
        count: enquiry.length,
        message: "Enquiries Found",
      });
    }
  } catch (error) {
    Logger.error(error.message + "at getAllEnquiry function " + controllerName);
    return Response.error(response, {
      data: [],
      message: error.message,
    });
  }
};

// -------------------------- get enquires for sale manager -------------------------------------

const getEnquiriesForSaleManager = async (req, res) => {
  try {
    const allSegmentOption = await DB.findDetails(Segment, {
      name: ALL_SEGMENT,
    });

    const mappList = await DB.findDetails(MapSalemanagerToSaleman, {
      saleManagerId: req.query.userId,
    });

    const saleMenArray = mappList.map((map) => map.saleMan);

    const unfilterEnquiries = await DB.findDetails(Enquiry, {
      siteId: req.query.siteId,
      $or: [{ userId: { $in: saleMenArray } }, { userId: req.query.userId }],
    });

    const finalEnquiryList = [];

    mappList.forEach((map) => {
      const mapSaleManString = map.saleMan.toString();
      const mapSaleManagerIdString = map.saleManagerId.toString();

      const filterEnquiries = unfilterEnquiries.filter((enquiry) => {
        const enquiryUserIdString = enquiry.userId.toString();
        return (
          (map.segment.includes(allSegmentOption[0]._id) &&
            mapSaleManString === enquiryUserIdString) ||
          (!map.segment.includes(allSegmentOption[0]._id) &&
            mapSaleManString === enquiryUserIdString &&
            map.segment.includes(enquiry.segment))
        );
      });

      finalEnquiryList.push(...filterEnquiries);

      const managerEnquires = unfilterEnquiries.filter((enquiry) => {
        const enquiryUserIdString = enquiry.userId.toString();
        return mapSaleManagerIdString === enquiryUserIdString;
      });

      finalEnquiryList.push(...managerEnquires);
    });

    return Response.success(res, {
      data: finalEnquiryList,
      count: finalEnquiryList.length,
      message: "Enquiries Found",
    });
  } catch (error) {
    Logger.error(
      error.message + "at getEnquiriesForSaleManager function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

/**
 * @description Update Enquiry
 * @param model mongoose Enquiry model && EnquiryStatuses
 */

const getEnquiryLogs = async (req, res, next) => {
  try {
    const query = { enquiryNumber: req.query.enquiryNumber };
    const enquiryLogDetail = await readEnquiryStatusesLog(query);
    return Response.success(res, {
      data: enquiryLogDetail,
      message: "Enquiry Log found",
    });
  } catch (error) {
    Logger.error(
      error.message + "at getEnquiryLogs function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

/**
 * @description Remove Enquiry
 * @param model mongoose Enquiry model
 * @param enquiryNumber string: params.id
 * @returns object: { success: boolean, error: boolean || error }
 */

const removeEnquiry = async (request, response, next) => {
  const enquiryNumber = request.params.id;
  try {
    if (!enquiryNumber) {
      let err = new Error("Invalid data !");
      err.name = "BAD_REQUEST";
      throw err;
    }
    await DB.remove(Enquiry, { enquiry_number: enquiryNumber });
    return Response.success(response, {
      data: [],
      message: "Enquiry removed !",
    });
  } catch (error) {
    Logger.error(error.message + "at removeEnquiry function " + controllerName);
    return Response.error(response, {
      data: [],
      message: error.message,
    });
  }
};

/**
 * @description Update Enquiry
 * @param model mongoose Enquiry model
 * @param enquiryNumber string: request.params.id
 * @returns object: { success: boolean, error: boolean || error }
 */

const updateEnquiry = async (request, response, next) => {
  try {
    const data = {
      ...request.body,
    };

    const myquery = { enquiry_number: request.params.id };

    // const modifierName = await DB.population(User, {
    //   queryString: { _id: request.query.auth_user_id },
    //   popString: "role",
    //   queryExclude: {
    //     password: 0,
    //     is_deleted: 0,
    //     refresh_token: 0,
    //     created_at: 0,
    //   },
    //   popExclude: {
    //     updated_at: 0,
    //     role_active: 0,
    //     __v: 0,
    //     created_at: 0,
    //   },
    // });

    // if (data.enquiry_status) {
    //   await makeEnquiryStatusLog({
    //     detailDescription:
    //       "Enquiry Status SuccessFully updated  to " + data.enquiry_status,
    //     enquiryNumber: request.params.id,
    //     status: data.enquiry_status,
    //     functionName: "createEnquiry",
    //     modifierName: modifierName[0].name ?? "ADMIN",
    //     created_at: DateTime.IST(),
    //     updated_at: DateTime.IST(),
    //   });
    // }

    await DB.CustomUpdate(Enquiry, { data, query: myquery });

    return Response.success(response, {
      data: [data],
      message: "Enquiry Data Updated",
    });
  } catch (error) {
    Logger.error(error.message + "at updateEnquiry function " + controllerName);
    return Response.error(response, {
      data: [],
      message: error.message,
    });
  }
};

/**
 * @description Get All Enquiry
 * @param model mongoose Enquiry model
 * @param Data string: request.body
 * @returns object: { success: boolean, error: boolean || error }
 */

const getEnquiryForPriceApproval = async (request, response, next) => {
  try {
    request.query.priceApprove = false;
    request.query.enquiry_status = "PRICEREQUEST";
    const enquiry = await DB.findDetails(Enquiry, request.query);

    if (enquiry.length) {
      for (let i = 0; i < enquiry.length; i++) {
        for (let j = 0; j < enquiry[i].attachment.length; j++) {
          const link = await getTempUrl(enquiry[i].attachment[j].fileName);
          const fileType = enquiry[i].attachment[j].fileType;
          enquiry[i].attachment[j] = {
            ...enquiry[i].attachment[j],
            link,
            fileType: enquiry[i].attachment[j].fileType,
            fileName: enquiry[i].attachment[j].fileName,
          };
        }
      }
      return Response.success(response, {
        data: enquiry,
        count: enquiry.length,
        message: `${enquiry.length} Enquiries Found For price Approval !`,
      });
    } else {
      return Response.success(response, {
        data: [],
        count: enquiry.length,
        message: "No Enquiries Found For price Approval!",
      });
    }
  } catch (error) {
    Logger.error(
      error.message + "at getEnquiryForPriceApproval function " + controllerName
    );
    return Response.error(response, {
      data: [],
      message: error.message,
    });
  }
};

/**
 * @description Approved And Reject Enquiry Self
 * @param model mongoose Enquiry model
 * @param data string: Request.body
 * @returns object: { success: boolean, error: boolean || error }
 */
const enquiryPriceApproval = async (req, res, next) => {
  try {
    let message;
    const myquery = { enquiry_number: req.params.enquiry_number };
    const data = {
      enquiry_status: req.body.priceApprove ? "APPROVED" : "PRICEREQUEST",
      ...req.body,
    };

    if (!req.body.priceApprove) {
      // Require reason if SelfApproval is false
      if (!req.body.remark) {
        return Response.error(res, {
          data: [],
          message:
            "Error: Reason is required when rejecting the price Approval",
        });
      }
      data.remark = req.body.remark;
    }

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
    await makeEnquiryStatusLog({
      detailDescription:
        "Enquiry Status SuccessFully updated  to " + data.enquiry_status,
      enquiryNumber: req.params.enquiry_number,
      status: data.enquiry_status,
      functionName: "enquiryPriceApproval",
      modifierName: modifierName[0].name ?? "ADMIN",
      created_at: DateTime.IST(),
      updated_at: DateTime.IST(),
    });

    const response = await DB.CustomUpdate(Enquiry, { data, query: myquery });

    if (response) {
      message = req.body.priceApprove
        ? "Enquiry Price Approved Successfully"
        : `Enquiry Price Rejected by admin Reason is: ${req.body.remark}`;

      return Response.success(res, {
        data: [],
        message: message,
      });
    } else {
      return Response.error(res, {
        data: [],
        message: "Error: Something Went Wrong!!!!",
      });
    }
  } catch (error) {
    console.log("errror", error);
    Logger.error(
      error.message + "at enquiryPriceApproval function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

/////////////////**************************  QUOTATIONS FUNCTIONS  *************************////////////////
/**
 * @description Create A quotation
 * @param model mongoose Quotation model
 * @param data string: Request.body
 * @returns object: { success: boolean, error: boolean || error }
 */

const createQuotations = async (request, response, next) => {
  try {
    const quoationData = {
      quotationNumber: await Number.generateQuotationNumber(),
      ...request.body,
      created_at: DateTime.IST("date"),
      updated_at: DateTime.IST("date"),
    };
    const quotationResponse = await DB.create(Quotation, quoationData);
    if (quotationResponse) {
      const myquery = { enquiry_number: quotationResponse[0].enquiryNumber };
      let data = {
        quotationMade: true,
        enquiry_status: "QUOTATION",
      };

      const modifierName = await DB.population(User, {
        queryString: { _id: request.query.auth_user_id },
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
      await makeEnquiryStatusLog({
        detailDescription:
          "Enquiry Status SuccessFully updated  to " + data.enquiry_status,
        enquiryNumber: quotationResponse[0].enquiryNumber,
        quotationNumber: quoationData.quotationNumber,
        status: data.enquiry_status,
        functionName: "createQuotations",
        modifierName: modifierName[0].name ?? "ADMIN",
        created_at: DateTime.IST(),
        updated_at: DateTime.IST(),
      });
      await DB.CustomUpdate(Enquiry, {
        data,
        query: myquery,
      });
      var totalAmount = 0;
      for (let i = 0; i < quotationResponse[0].chargesDetails.length; i++) {
        totalAmount +=
          quotationResponse[0].chargesDetails[i].taxableAmountInAed +
          quotationResponse[0].chargesDetails[i].vatAmountInAed;
      }
      quotationResponse[0].chargesDetails;
      await makeQuoationLog({
        enquiryNumber: quotationResponse[0].enquiryNumber,
        quotationNumber: quoationData.quotationNumber,
        status: quotationResponse[0].approvalStatus,
        modifierName: modifierName[0].name || "ADMIN",
        amount: totalAmount,
        detailDescription: "Quotation has been made of amount " + totalAmount,
      });

      return Response.success(response, {
        data: [quoationData],
        message: "Quotation Sent !",
      });
    }
    return Response.error(response, {
      data: [],
      message: "Quotation Not Send!",
    });
  } catch (error) {
    Logger.error(
      error.message + "at createQuotations function " + controllerName
    );
    return Response.error(response, {
      data: [],
      message: error.message,
    });
  }
};

/**
 * @description Get All Created quotation
 * @param model mongoose Quotation model
 * @param data string: Request.body
 * @returns object: { success: boolean, error: boolean || error }
 */
const getAllQuotations = async (request, response, next) => {
  try {
    const allQuotations = await DB.findDetails(Quotation, request.query);
    return Response.success(response, {
      data: allQuotations,
      count: allQuotations.length,
      message: "Quotations Found !",
    });
  } catch (error) {
    Logger.error(
      error.message + "at getAllQuotations function " + controllerName
    );
    return Response.error(response, {
      data: [],
      message: error.message,
    });
  }
};
/**
 * @description Remove Quotation
 * @param model mongoose Quotation model
 * @param QuotationNumber string: params.id
 * @returns object: { success: boolean, error: boolean || error }
 */

const removeQuotations = async (request, response, next) => {
  const quotationNumber = request.params.quotationNumber;
  try {
    if (!quotationNumber) {
      let err = new Error("Invalid data !");
      err.name = "BAD_REQUEST";
      throw err;
    }
    await DB.remove(Quotation, { quotation_number: quotationNumber });
    return Response.success(response, {
      data: [],
      message: "Quotation removed !",
    });
  } catch (error) {
    Logger.error(
      error.message + "at removeQuotations function " + controllerName
    );
    return Response.error(response, {
      data: [],
      message: error.message,
    });
  }
};

/**
 * @description Update quotation
 * @param model mongoose quotation model
 * @param quotationNumber string: request.params.id
 * @returns object: { success: boolean, error: boolean || error }
 */

const updateQuotations = async (request, response, next) => {
  try {
    const myquery = { quotationNumber: request.params.quotationNumber };

    const data = {
      ...request.body,
    };

    const modifierName = await DB.population(User, {
      queryString: { _id: request.query.auth_user_id },
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

    var quotationDetail;
    var statuTotalAmount = 0;

    if (
      data.approvalStatus === "APPROVED" ||
      data.approvalStatus === "REJECTED"
    ) {
      quotationDetail = await DB.findDetails(Quotation, myquery);

      for (let i = 0; i < quotationDetail[0].chargesDetails.length; i++) {
        statuTotalAmount +=
          quotationDetail[0].chargesDetails[i].taxableAmountInAed +
          quotationDetail[0].chargesDetails[i].vatAmountInAed;
      }
    }

    if (data.approvalStatus === "APPROVED") {
      const enquiryNumber = {
        enquiry_number: data.enquiryNumber,
      };
      const enquiryData = {
        quotationApprove: true,
        enquiry_status: "QUOTEWON",
      };
      await DB.CustomUpdate(Enquiry, {
        data: enquiryData,
        query: enquiryNumber,
      });

      await makeQuoationLog({
        enquiryNumber: quotationDetail[0].enquiryNumber,
        quotationNumber: data.quotationNumber,
        status: data.approvalStatus,
        modifierName: modifierName[0].name || "ADMIN",
        amount: statuTotalAmount,
        detailDescription:
          "Quotation has been made of amount " + statuTotalAmount,
      });
    } else if (data.approvalStatus === "REJECTED") {
      await makeQuoationLog({
        enquiryNumber: quotationDetail[0].enquiryNumber,
        quotationNumber: data.quotationNumber,
        status: data.approvalStatus,
        modifierName: modifierName[0].name || "ADMIN",
        amount: statuTotalAmount,
        detailDescription:
          "Quotation has been rejected for amount " + statuTotalAmount,
      });
    } else {
      var totalAmount = 0;
      for (let i = 0; i < data.chargesDetails.length; i++) {
        totalAmount +=
          data.chargesDetails[i].taxableAmountInAed +
          data.chargesDetails[i].vatAmountInAed;
      }

      await makeQuoationLog({
        enquiryNumber: data.enquiryNumber,
        quotationNumber: data.quotationNumber,
        status: data.approvalStatus,
        modifierName: modifierName[0].name || "ADMIN",
        amount: totalAmount,
        detailDescription:
          "Quotation has been updated and their amount " + totalAmount,
      });
    }
    await DB.CustomUpdate(Quotation, { data, query: myquery });

    return Response.success(response, {
      data: [data],
      message: "Quotation update",
    });
  } catch (error) {
    Logger.error(
      error.message + "at updateQuotations function " + controllerName
    );
    return Response.error(response, {
      data: [],
      message: error.message,
    });
  }
};

const getQuotationById = async (request, response, next) => {
  try {
    const quotation = await DB.aggregation(Quotation, [
      { $match: { quotationNumber: request.params.id } },
      {
        $lookup: {
          from: "enquiries",
          localField: "enquiryNumber",
          foreignField: "enquiry_number",
          as: "enquiry",
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customerEmail",
          foreignField: "customer_email",
          as: "customer",
        },
      },
    ]);

    if (quotation.length > 0) {
      return response.json({
        data: quotation,
        count: quotation.length,
        message: "Quotation found",
      });
    }

    return response.json({
      data: [],
      count: 0,
      message: "No quotation found",
    });
  } catch (error) {
    Logger.error(
      error.message + "at getQuotationsById function " + controllerName
    );
    return Response.error(response, {
      data: [],
      message: error.message,
    });
  }
};

// ---------------------- get quotation by sale manager --------------------------------------------

const getQuotationForSaleManager = async (req, res) => {
  try {
    const allSegmentOption = await DB.findDetails(Segment, {
      name: ALL_SEGMENT,
    });

    const mappList = await DB.findDetails(MapSalemanagerToSaleman, {
      saleManagerId: req.query.userId,
    });

    const saleMenArray = mappList.map((map) => map.saleMan);

    const unfilterQuotation = await DB.findDetails(Quotation, {
      siteId: req.query.siteId,
      $or: [{ userId: { $in: saleMenArray } }, { userId: req.query.userId }],
    });

    const finalQuotationList = [];

    mappList.forEach((map) => {
      const mapSaleManString = map.saleMan.toString();
      const mapSaleManagerIdString = map.saleManagerId.toString();

      const filterQuotation = unfilterQuotation.filter((quotation) => {
        const quotationUserIdString = quotation.userId.toString();
        return (
          (map.segment.includes(allSegmentOption[0]._id) &&
            mapSaleManString === quotationUserIdString) ||
          (!map.segment.includes(allSegmentOption[0]._id) &&
            mapSaleManString === quotationUserIdString &&
            map.segment.includes(quotation.segment))
        );
      });
      finalQuotationList.push(...filterQuotation);

      const managerQuotations = unfilterQuotation.filter((quotation) => {
        const quotationUserIdString = quotation.userId.toString();
        return mapSaleManagerIdString === quotationUserIdString;
      });

      finalQuotationList.push(...managerQuotations);
    });

    return Response.success(res, {
      data: finalQuotationList,
      count: finalQuotationList.length,
      message: "Enquiries Found",
    });
  } catch (error) {
    Logger.error(
      error.message + "at getQuotationForSaleManager function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

/////////////////**************************  LEAD FUNCTIONS  *************************////////////////

/**
 * @description Create A LEAD
 * @param model mongoose LEAD model
 * @param data string: Request.body
 * @returns object: { success: boolean, error: boolean || error }
 */

const createLead = async (request, response, next) => {
  try {
    const data = {
      leadNumber: await Number.generateLeadNumber(),
      ...request.body,
      created_at: DateTime.IST("date"),
      updated_at: DateTime.IST("date"),
    };
    await DB.create(Lead, data);
    return Response.success(response, {
      data: [data],
      message: "Lead Added !",
    });
  } catch (error) {
    Logger.error(error.message + "at createLead function " + controllerName);
    return Response.error(response, {
      data: [],
      message: error.message,
    });
  }
};
/**
 * @description Get All Created Lead
 * @param model mongoose Lead model
 * @param data string: Request.body
 * @returns object: { success: boolean, error: boolean || error }
 */

const getAllLeads = async (request, response, next) => {
  try {
    const allLeads = await DB.findDetails(Lead, request.query);
    if (allLeads.length > 0) {
      return Response.success(response, {
        data: allLeads,
        count: allLeads.length,
        message: "Leads Founds",
      });
    } else {
      return Response.success(response, {
        data: [],
        count: 0,
        message: "No Records Found",
      });
    }
  } catch (error) {
    Logger.error(error.message + "at getAllLeads function " + controllerName);
    return Response.error(response, {
      data: [],
      message: error.message,
    });
  }
};
/**
 * @description Remove Lead
 * @param model mongoose Lead model
 * @param LeadNumber string: params.id
 * @returns object: { success: boolean, error: boolean || error }
 */

const removeLead = async (request, response, next) => {
  const leadNumber = request.params.leadNumber;
  try {
    if (!leadNumber) {
      let err = new Error("Invalid data !");
      err.name = "BAD_REQUEST";
      throw err;
    }
    await DB.remove(Lead, { leadNumber: leadNumber });
    return Response.success(response, {
      data: [],
      message: "Lead removed !",
    });
  } catch (error) {
    Logger.error(error.message + "at removeLead function " + controllerName);
    return Response.error(response, {
      data: [],
      message: error.message,
    });
  }
};

const getLeadById = async (request, response, next) => {
  const leadNumber = request.params.id;
  try {
    const lead = await DB.findDetails(Lead, { leadNumber: leadNumber });
    return Response.success(response, {
      data: lead,
      message: "Lead Found",
    });
  } catch (error) {
    Logger.error(error.message + "at getLeadById function " + controllerName);
    return Response.error(response, {
      data: [],
      message: error.message,
    });
  }
};

/**
 * @description Update Lead
 * @param model mongoose Lead model
 * @param leadNumber string: request.params.id
 * @returns object: { success: boolean, error: boolean || error }
 */
const updateLead = async (request, response, next) => {
  try {
    const myquery = { leadNumber: request.params.leadNumber };
    const data = {
      ...request.body,
    };
    await DB.CustomUpdate(Lead, { data, query: myquery });
    return Response.success(response, {
      data: [data],
      message: "Lead Update",
    });
  } catch (error) {
    Logger.error(error.message + "at updateLead function " + controllerName);
    return Response.error(response, {
      data: [],
      message: error.message,
    });
  }
};

// -------------------------------get lead by salemanager -------------------------------

const getLeadForSaleManager = async (req, res) => {
  try {
    const allSegmentOption = await DB.findDetails(Segment, {
      name: ALL_SEGMENT,
    });

    const mappList = await DB.findDetails(MapSalemanagerToSaleman, {
      saleManagerId: req.query.userId,
    });

    const saleMenArray = mappList.map((map) => map.saleMan);

    const unfilterLeads = await DB.findDetails(Lead, {
      siteId: req.query.siteId,
      $or: [{ userId: { $in: saleMenArray } }, { userId: req.query.userId }],
    });

    const finalLeadList = [];

    mappList.forEach((map) => {
      const mapSaleManString = map.saleMan.toString();
      const mapSaleManagerIdString = map.saleManagerId.toString();

      const filterEnquiries = unfilterLeads.filter((lead) => {
        const leadUserIdString = lead.userId.toString();
        return (
          (map.segment.includes(allSegmentOption[0]._id) &&
            mapSaleManString === leadUserIdString) ||
          (!map.segment.includes(allSegmentOption[0]._id) &&
            mapSaleManString === leadUserIdString &&
            map.segment.includes(lead.segment))
        );
      });

      finalLeadList.push(...filterEnquiries);

      const managerEnquires = unfilterLeads.filter((lead) => {
        const leadUserIdString = lead.userId.toString();
        return mapSaleManagerIdString === leadUserIdString;
      });

      finalLeadList.push(...managerEnquires);
    });

    return Response.success(res, {
      data: finalLeadList,
      count: finalLeadList.length,
      message: "Leads Found",
    });
  } catch (error) {
    Logger.error(
      error.message + "at getLeadForSaleManager function " + controllerName
    );
    return Response.error(res, {
      data: [],
      message: error.message,
    });
  }
};

// ================================== file operation =====================================

const upLoadFile = async (request, response) => {
  try {
    const fileName = await uploadFile(
      request.body.file,
      "EnquiryDocuments",
      request.body.fileType
    );
    const url = await getTempUrl(fileName);
    return Response.success(response, {
      data: { url, fileName },
      message: "File Uploaded",
    });
  } catch (error) {
    Logger.error(error.message + "at upLoadFile function " + controllerName);
    return Response.error(response, {
      data: [],
      message: error.message,
    });
  }
};

const deleteFile = async (request, response) => {
  try {
    const fileDeleted = await s3Delete(request.params.fileName);
    return Response.success(response, {
      data: fileDeleted,
      message: "File Deleted",
    });
  } catch (error) {
    Logger.error(error.message + "at deleteFile function " + controllerName);
    return Response.error(response, {
      data: [],
      message: error.message,
    });
  }
};

module.exports = {
  //****** Enquiry *******/
  updateEnquiry,
  removeEnquiry,
  getAllEnquiry,
  createEnquiry,
  getEnquiryForPriceApproval,
  enquiryPriceApproval,
  getEnquiryLogs,
  getEnquiriesForSaleManager,

  //****** Quotations *******/
  createQuotations,
  getAllQuotations,
  updateQuotations,
  removeQuotations,
  getQuotationById,
  getQuotationForSaleManager,

  //****** Leads *******/
  createLead,
  getAllLeads,
  updateLead,
  removeLead,
  getLeadById,
  getLeadForSaleManager,

  //******Operation File*******/
  upLoadFile,
  deleteFile,
};
