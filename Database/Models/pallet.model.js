const { Schema, model } = require("mongoose");
const palletSchema = new Schema({
  palletNumber: { type: String, required: true },
  active: { type: Boolean },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const Pallet = model("Pallet", palletSchema);
module.exports = Pallet;
