const { Schema, model } = require("mongoose");
const USER = "User";
const SITE = "Site";
const leadSchema = new Schema({
  leadNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  contactPerson: { type: String, required: true },
  industry: { type: String, required: true },
  volumeMode: { type: String, required: true },
  remark: { type: String, required: true },
  activeStatus: { type: Boolean, default: true },
  contactMode: { type: String },
  segment: { type: Array, required: true },
  siteId: { type: Schema.Types.ObjectId, ref: SITE },
  userId: { type: Schema.Types.ObjectId, ref: USER },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

const Lead = model("Lead", leadSchema);
module.exports = Lead;
