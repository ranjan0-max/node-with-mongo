const { Schema, model } = require("mongoose");

const SiteSchema = new Schema({
  country: { type: String, required: true, ref: "Country" },
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  contact_no: { type: Number, required: true },
  site_active: { type: Boolean, required: true, default: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

const Site = model("Site", SiteSchema);
module.exports = Site;
