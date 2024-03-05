const mongoose = require("mongoose");
const mapSalemanagerToSalemanSchema = new mongoose.Schema({
  siteId: { type: mongoose.Schema.Types.ObjectId },
  saleManagerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  saleMan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  segment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Segment" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date },
  updated_at: { type: Date },
});
mapSalemanagerToSalemanSchema.index(
  { saleManagerId: 1, saleMan: 1, siteId: 1 },
  { name: "saleManagerId_1_saleMan_1siteId_1", unique: true }
);
const MapSalemanagerToSaleman = mongoose.model(
  "MapSalemanagerToSaleman",
  mapSalemanagerToSalemanSchema
);
module.exports = MapSalemanagerToSaleman;
