const { Schema, model } = require('mongoose');

const searchItemSchema = new Schema({
    id: { type: String, required: true },
    search_key: { type: String, required: true },
    path: { type: String, required: true }
});

const SearchItem = model('SearchItem', searchItemSchema);
module.exports = SearchItem;
