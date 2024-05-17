const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
  currencyName: { type: String, required: true, unique: true },
  currencyCode: { type: String, required: true },
  currencyDate: { type: Date, required: true },
  sellRate: { type: Number, required: true },
  activeStatus: { type: Boolean, default: true },
});

module.exports = mongoose.model("Currency", currencySchema);
