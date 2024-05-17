const { Schema, model } = require("mongoose");
const USER = "User";
const SITE = "Site";
const SEGMENT = "Segment";

const quotation_schema = new Schema({
  quotationNumber: { type: String, required: true, unique: true },
  enquiryNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  customerAddress: { type: String },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  pol: { type: String },
  pod: { type: String },
  segment: { type: Schema.Types.ObjectId, ref: SEGMENT },
  cargoType: { type: String },
  shipperName: { type: String },
  shipperAddress: { type: String },
  approvalStatus: { type: String, default: "PENDING" },
  transitTime: { type: Number },
  chargesDetails: { type: Array, required: true },
  contactPerson: { type: String },
  remark: { type: String },
  siteId: { type: Schema.Types.ObjectId, ref: SITE, index: true },
  userId: { type: Schema.Types.ObjectId, ref: USER },
});

const Quotation = model("Quotation", quotation_schema);
module.exports = Quotation;
