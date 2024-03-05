const { Schema, model } = require('mongoose');
const chargeCodeSchema = new Schema({
    chargeCode: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    chargeCodeActive: { type: Boolean, default: true },
    vat: { type: Number, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true }
});

const ChargeCode = model('ChargeCode', chargeCodeSchema);
module.exports = ChargeCode;
