const { Schema, model } = require("mongoose");
const ExportJobSchema = new Schema({
  jobNumber: { type: String, unique: true, required: true },
  loadListNumber: { type: String, unique: true, required: true },
  origin: { type: String },
  destination: { type: String },
  destinationSiteId: { type: String, required: true },
  status: { type: String },
  driverId: { type: Schema.Types.ObjectId, ref: "Driver" },
  ETA: { type: Date },
  ETD: { type: Date },
  vehicleNumber: { type: String },
  jobDate: { type: Date },
  agentId: { type: Schema.Types.ObjectId },
  jobAccepted: { type: Boolean, default: false },
  jobCancel: { type: Boolean, default: false },
  siteId: {
    type: Schema.Types.ObjectId,
    ref: "Site",
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const ExportJob = model("ExportJob", ExportJobSchema);
module.exports = ExportJob;
