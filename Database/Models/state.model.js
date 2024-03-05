const { Schema, model } = require("mongoose");

const stateSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  country_id: { type: Number, required: true },
});

const State = model("State", stateSchema);
module.exports = State;
