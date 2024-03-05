const { Schema, model } = require("mongoose");

const FmlStatusSchema = new Schema({
  fmlBookingNumber: { type: String, required: true },
  status: { type: String }, // ASSIGNED, REACHED, PICKED, WAREHOUSE_IN, CANCELLED
  reason: { type: String },
  enquiryNumber: { type: String },
  fieldExecutive: { type: Schema.Types.ObjectId, ref: "FieldExecutive" },
  attemptCount: { type: Number },
  modifierName: { type: String },
  detailDescription: { type: String },
  functionName: { type: String },
  packageAssign: { type: Number },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const FirstMilePickupStatus = model("FirstMilePickupStatus", FmlStatusSchema);
module.exports = FirstMilePickupStatus;
