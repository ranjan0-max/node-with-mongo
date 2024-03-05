const { Schema, model } = require("mongoose");
const serviceSchema = new Schema({
  chargeCode: {
    type: String, // Reference chargeCode using the unique identifier
    ref: "ChargeCode",
    required: true,
  },
  serviceCode: { type: String, required: true },
  serviceName: { type: String, required: true },
  serviceActive: { type: Boolean, default: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

const Service = model("Service", serviceSchema);
module.exports = Service;
