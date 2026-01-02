const express = require('express');
const router = express.Router();

const Order = require('./../models/order');
const MenuItem = require('./../models/menuItem');
const Notification = require('./../models/notification');

const { jwtAuthMiddleware } = require('./../middleware/jwt');
const roleCheck = require('./../middleware/roleCheck');

router.post('/ordermenu', jwtAuthMiddleware, roleCheck(["customer"]), async (req, res) => {
	try {
		const userId = req.user.id;
		const { items } = req.body;

		if(!items || !items.length) {
			return res.status(400).json({
				message: "Order items are required"
			});
		}

		const foodItems = [];

		for (const item of items) {
			const menuItem = await MenuItem.findById(item.menuItemId);

			if (!menuItem) {
				return res.status(404).json({
				message: "Menu item not found"
				});
			}

			if (!menuItem.availableForDelivery) {
				return res.status(400).json({
				message: `Item "${menuItem.name}" is currently not available for delivery`
				});
			}

			if (item.quantity <= 0) {
				return res.status(400).json({
				message: "Quantity must be at least 1"
				});
			}

			foodItems.push({
				foodName: menuItem.name,
				quantity: item.quantity
			});
		}

		const order = await Order.create({
			userId,
			foodItems,
			orderTime: new Date(),
			status: "pending"
		});

		await Notification.create({
			userId,
			message: "Order placed successfully"
		});

		res.status(201).json({
			message: "Order placed successfully",
			order
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Internal Server Error",
			message: error.message
		});
	}
});

router.get('/my', jwtAuthMiddleware, roleCheck(["customer"]), async (req, res) => {
	try {
		const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });

		res.json({
			count: orders.length,
			orders
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Internal Server Error",
			message: error.message
		});
	}
});

router.get('/all', jwtAuthMiddleware, roleCheck(["admin", "manger", "staff"]), async (req, res) => {
	const orders = await Order.find().populate("userId", "name phone").sort({ createdAt: -1 });

	res.json({
		count: orders.length,
		orders
	});
});

module.exports = router;
