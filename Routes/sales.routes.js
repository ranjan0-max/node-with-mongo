const express = require("express");
const SaleController = require("../Controllers/sales.controller");
const router = express.Router();
const { authJwt, authorize } = require("../Middleware/apiAuth.middleware");

router
  //Enquiry Routes

  .get("/enquiry", authJwt, SaleController.getAllEnquiry)
  .get(
    "/enquiriesForSaleManager",
    authJwt,

    SaleController.getEnquiriesForSaleManager
  )
  .post("/enquiry", authJwt, SaleController.createEnquiry)
  .put("/enquiry/:id", authJwt, SaleController.updateEnquiry)

  .get(
    "/enquiry/price-approval",
    authJwt,
    SaleController.getEnquiryForPriceApproval
  )
  .patch(
    "/enquiry/price-approval/:enquiry_number",
    authJwt,
    SaleController.enquiryPriceApproval
  )
  .delete("/enquiry/:id", authJwt, SaleController.removeEnquiry)
  .get("/logs", authJwt, SaleController.getEnquiryLogs)

  //Quotations Routes

  .get("/quotation", authJwt, SaleController.getAllQuotations)
  .get("/quotationForSaleManager", SaleController.getQuotationForSaleManager)
  .post("/quotation", authJwt, SaleController.createQuotations)
  .put("/quotation/:quotationNumber", authJwt, SaleController.updateQuotations)
  .delete(
    "/quotation/:quotationNumber",
    authJwt,
    SaleController.removeQuotations
  )
  .get("/quotation/:id", authJwt, SaleController.getQuotationById)

  //Leads Routes

  .get("/lead", authJwt, SaleController.getAllLeads)
  .post("/lead", authJwt, SaleController.createLead)
  .put("/lead/:leadNumber", authJwt, SaleController.updateLead)
  .delete("/lead/:leadNumber", authJwt, SaleController.removeLead)
  .get("/lead/:id", authJwt, SaleController.getLeadById)

  //Upload File

  .post("/uploadFile", authJwt, SaleController.upLoadFile)
  .delete("/deleteFile/:fileName", authJwt, SaleController.deleteFile);

module.exports = router;
