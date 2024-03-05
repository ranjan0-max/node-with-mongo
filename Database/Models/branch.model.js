const { Schema, model } = require('mongoose');
const branchSchema = new Schema({
    site_id: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Site'
        }
    ],
    branch_name: { type: String, required: true },
    branch_code: { type: String, required: true },
    branch_active: { type: Boolean, required: true, default: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true }
});

const Branch = model('Branch', branchSchema);
module.exports = Branch;
