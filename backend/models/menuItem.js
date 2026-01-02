const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: Number
    },
    availableForDelivery: {
        type: Boolean,
        default: true
    }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;