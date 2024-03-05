const { Schema, model } = require("mongoose");

const EnquiryLogSchema = new Schema({
  enquiryNumber: { type: String, required: true, index: true },
  quotationNumber: { type: String },
  status: { type: String }, // ENQUIRY, PRICEREQUEST, APPROVED, QUOTATION, QUOTEWON,QUOTELOST,PRE_BOOKED, BOOKED
  reason: { type: String },
  modifierName: { type: String },
  detailDescription: { type: String },
  functionName: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const EnquiryLog = model("EnquiryLog", EnquiryLogSchema);
module.exports = EnquiryLog;
