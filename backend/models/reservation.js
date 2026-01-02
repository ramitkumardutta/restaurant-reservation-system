const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const reservationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table"
    },
    bookingType: String,
    peopleCount: Number,
    startTime: Date,
    endTime: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;