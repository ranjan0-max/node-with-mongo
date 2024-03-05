const { Schema, model } = require('mongoose');
const sidebarMenuSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    config: { type: Array, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true }
});

const SideBarMenu = model('SideBarMenu', sidebarMenuSchema);
module.exports = SideBarMenu;
