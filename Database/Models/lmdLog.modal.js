const { Schema, model } = require("mongoose");

const LmdLogSchema = new Schema({
  orderNumber: { type: String },
  status: { type: String },
  siteName: { type: String },
  modifierName: { type: String },
  detailDescription: { type: String },
  reason: { type: String },
  functionName: { type: String },
  fieldExecutive: { type: Schema.Types.ObjectId, ref: "FieldExecutive" },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const LmdLog = model("LmdLog", LmdLogSchema);
module.exports = LmdLog;
