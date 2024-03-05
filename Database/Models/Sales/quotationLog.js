const { Schema, model } = require("mongoose");

const QuotationLogSchema = new Schema({
  enquiryNumber: { type: String, required: true },
  quotationNumber: { type: String, required: true },
  status: { type: String },
  modifierName: { type: String },
  detailDescription: { type: String },
  amount: { type: Number },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const QuotationLog = model("QuotationLog", QuotationLogSchema);
module.exports = QuotationLog;
