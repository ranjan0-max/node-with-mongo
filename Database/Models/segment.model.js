const { Schema, model } = require("mongoose");
const segmentSchema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  classification: { type: String, default: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

const Segment = model("Segment", segmentSchema);
module.exports = Segment;
