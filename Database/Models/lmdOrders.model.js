const { Schema, model } = require("mongoose");

const LmdOrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  qrCodeList: { type: Array, required: true },
  status: { type: String },
  modifierName: { type: String },
  bookingNumber: { type: String, required: true },
  consigneeName: { type: String },
  consigneeAddress: { type: String },
  consigneeMobileNumber: { type: String },
  pod: { type: String },
  cod: { type: Number },
  attempCount: { typer: Number },
  fieldExecutive: { type: Schema.Types.ObjectId, ref: "FieldExecutive" },
  siteId: { type: Schema.Types.ObjectId, ref: "Site" },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const LmdOrder = model("LmdOrder", LmdOrderSchema);
module.exports = LmdOrder;
