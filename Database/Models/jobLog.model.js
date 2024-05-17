const { Schema, model } = require("mongoose");

const JobLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  jobNumber: { type: String, required: true },
  refrenceNumber: { type: String },
  status: { type: String },
  vehicleNumber: { type: String },
  siteName: { type: String },
  modifierName: { type: String },
  detailDescription: { type: String },
  functionName: { type: String },
  date: { type: Date },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const JobLog = model("JobLog", JobLogSchema);
module.exports = JobLog;
