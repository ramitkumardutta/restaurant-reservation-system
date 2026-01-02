const express = require('express');
const router = express.Router();

const Reservation = require('./../models/reservation');
const { jwtAuthMiddleware } = require('./../middleware/jwt');
const roleCheck = require('./../middleware/roleCheck');

// Create a reservation (customer only)
router.post('/', jwtAuthMiddleware, roleCheck(['customer']), async (req, res) => {
	try {
		const { bookingType, peopleCount, startTime } = req.body;
		const reservation = await Reservation.create({
			userId: req.user.id,
			bookingType,
			peopleCount,
			startTime: startTime ? new Date(startTime) : undefined,
		});

		res.status(201).json({ message: 'Reservation created', reservation });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error', message: err.message });
	}
});

// Get reservation history for current user (customer only)
router.get('/history', jwtAuthMiddleware, roleCheck(['customer']), async (req, res) => {
	try {
		const reservations = await Reservation.find({ userId: req.user.id }).sort({ createdAt: -1 });
		res.json({ count: reservations.length, reservations });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error', message: err.message });
	}
});

module.exports = router;
