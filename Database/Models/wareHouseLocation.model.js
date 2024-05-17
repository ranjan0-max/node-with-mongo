const { Schema, model } = require("mongoose");
const wareHouseLocationSchema = new Schema({
  siteId: {
    type: Schema.Types.ObjectId,
    ref: "Site",
  },
  storageName: { type: String, required: true, unique: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

const WareHouseLocation = model("WareHouseLocation", wareHouseLocationSchema);
module.exports = WareHouseLocation;
