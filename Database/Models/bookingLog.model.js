const { Schema, model } = require("mongoose");

const BookingLogSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  refNumber: { type: String, required: true },
  status: { type: String }, // WAREHOUSE_IN,
  reason: { type: String },
  attemptCount: { type: Number },
  modifierName: { type: String },
  detailDescription: { type: String },
  functionName: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const BookingLog = model("BookingLog", BookingLogSchema);
module.exports = BookingLog;
