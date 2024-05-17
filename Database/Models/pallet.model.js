const { Schema, model } = require("mongoose");
const palletSchema = new Schema({
  palletNumber: { type: String, required: true, unique: true },
  loadListNumber: { type: String, default: "EMPTY" },
  acquired: { type: Boolean, default: false },
  deviceId: { type: String, default: "EMPTY" },
  status: { type: String, default: "EMPTY" },
  destination: { type: String, default: "EMPTY" },
  segment: { type: String },
  loadList: { type: String },
  active: { type: Boolean },
  lotNumber: { type: Number },
  closed: { type: Boolean, default: false },
  siteId: {
    type: Schema.Types.ObjectId,
    ref: "Site",
  },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const Pallet = model("Pallet", palletSchema);
module.exports = Pallet;
