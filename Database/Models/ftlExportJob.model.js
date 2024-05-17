const { Schema, model } = require("mongoose");
const FtlExportJobSchema = new Schema({
  jobNumber: { type: String, unique: true, required: true },
  bookingNumber: { type: String, required: true },
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
  siteId: {
    type: Schema.Types.ObjectId,
    ref: "Site",
  },
  pod: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const FtlExportJob = model("FtlExportJob", FtlExportJobSchema);
module.exports = FtlExportJob;
