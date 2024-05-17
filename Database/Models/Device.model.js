const { Schema, model } = require("mongoose");
const SITE = "Site";
const DeviceSchema = new Schema({
  siteId: { type: Schema.Types.ObjectId, ref: SITE, index: true },
  deviceName: { type: String, required: true },
  deviceId: { type: String, required: true, unique: true },
  devicePerson: { type: String },
  deviceRole: { type: Array },
  config: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  mappedUser: { type: Schema.Types.ObjectId, ref: "User" },
  device_token: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const Device = model("Device", DeviceSchema);
module.exports = Device;
