const { Schema, model } = require('mongoose');

const countrySchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    phonecode: { type: Number, required: true, unique: true },
    country_active: { type: Boolean, required: true, default: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true }
});

const Country = model('Country', countrySchema);
module.exports = Country;
