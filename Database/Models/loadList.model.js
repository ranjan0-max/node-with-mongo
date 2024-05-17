const { Schema, model } = require("mongoose");
const loadListSchema = new Schema({
  loadListNumber: { type: String, unique: true },
  destination: { type: String },
  deviceId: { type: String },
  status: { type: String },
  siteId: {
    type: Schema.Types.ObjectId,
    ref: "Site",
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  palletList: { type: Array },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const LoadList = model("LoadList", loadListSchema);
module.exports = LoadList;
