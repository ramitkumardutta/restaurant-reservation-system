const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const tableSchema = new mongoose.Schema({
    tableNumber: Number,
    capacity: Number,
    isActive: {
        type: Boolean,
        default: true 
    }
});

const Table = mongoose.model('Table', tableSchema);
module.exports = Table;