const express = require('express');
const router = express.Router();

const Reservation = require('./../models/reservation');
const { jwtAuthMiddleware } = require('./../middleware/jwt');
const roleCheck = require('../middleware/roleCheck');

router.get('/all-reservations', jwtAuthMiddleware, roleCheck(["admin", "manager", "staff"]), async (req, res) => {
	try {
        const reservations = await Reservation.find().populate("userId", "name phone").populate("tableId", "tableNumber capacity").sort({ startTime: 1 });
        res.json({
            count: reservations.length, reservations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Interval Server Error"
        });
    }
});

module.exports = router;
