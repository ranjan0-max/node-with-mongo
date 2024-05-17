const { Schema, model } = require("mongoose");
const SITE = "Site";
const DriverSchema = new Schema({
  driverName: { type: String, required: true },
  transporter: { type: Boolean },
  password: { type: String },
  otpVerified: { type: Boolean, default: false },
  mobile: { type: String },
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
  driverLicense: { type: String },
  driverLicenseExpiryDate: { type: Date },
  insurance: { type: String },
  insuranceExpiryDate: { type: Date },
  passport: { type: String },
  passportExpiryDate: { type: Date },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const Driver = model("Driver", DriverSchema);
module.exports = Driver;
