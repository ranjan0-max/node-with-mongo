const { Schema, model } = require("mongoose");

const MileStoneSchema = new Schema({
  name: { type: String, required: true, unique: true },
  mileStoneType: { type: String, required: true },
  mileStoneStatus: { type: Boolean },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const MileStone = model("MileStone", MileStoneSchema);
module.exports = MileStone;
