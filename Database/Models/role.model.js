const { Schema, model } = require('mongoose');

const roleSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    role: { type: String, required: true, unique: true },
    role_active: { type: Boolean, required: true, default: true },
    priority: { type: Number, required: true },
    permissions: [{ type: String }],
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true }
});

const Role = model('Role', roleSchema);
module.exports = Role;
