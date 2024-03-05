const { Schema, model } = require("mongoose");
const locationSchema = new Schema({
  country_id: { type: Number, required: true, ref: "Country" },
  site_id: {
    type: Schema.Types.ObjectId,
    ref: "Site",
  },
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  active_status: { type: Boolean, required: true, default: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

const Location = model("Location", locationSchema);
module.exports = Location;
