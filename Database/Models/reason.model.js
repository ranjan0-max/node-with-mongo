const { Schema, model } = require("mongoose");

const reasonSchema = new Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  classification: { type: String },
  reason_active: { type: Boolean, required: true, default: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

const Reason = model("Reason", reasonSchema);
module.exports = Reason;
