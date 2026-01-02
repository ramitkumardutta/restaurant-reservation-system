const express = require('express');
const router = express.Router();

const MenuItem = require('./../models/menuItem');
const { jwtAuthMiddleware } = require('./../middleware/jwt');
const roleCheck = require('./../middleware/roleCheck');

router.get('/', async (req, res) => {
	try {
		const menu = await MenuItem.find({ availableForDelivery: true});
		res.json(menu);
	} catch (error) {
		console.error(error && error.stack ? error.stack : error);
		// Return error message and stack during development to aid debugging
	        res.status(500).json({ error: 'Internal Server Error', message: error.message, stack: error.stack });
	}
});

// Admin and manager can access
// New RESTful create endpoint (keeps legacy `/addmenu` for compatibility)
router.post('/', jwtAuthMiddleware, roleCheck(["admin", "manager"]), async (req, res) => {
	try {
		console.log('menu create req.user =>', req.user);
		const { name, price, availableForDelivery } = req.body;

		const item = await MenuItem.create({
			name, 
			price,
			availableForDelivery
		});

		res.status(201).json({
			message: "Menu item added successfully",
			item
		});
	} catch (error) {
		console.log(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
	}
});

// Admin / manager update menu item
// RESTful update
router.put('/:id', jwtAuthMiddleware, roleCheck(["admin", "manager"]), async (req, res) => {
	try {
		const updated = await MenuItem.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new : true }
		);
		res.json(updated);
	} catch (error) {
		console.log(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
	}
});

// Admin can delete menu item
// RESTful delete
router.delete('/:id', jwtAuthMiddleware, roleCheck(["admin"]), async (req, res) => {
	try {
		await MenuItem.findByIdAndDelete(req.params.id);
		res.json({
			message: "Menu item deleted"
		})
	} catch (error) {
		console.log(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
	}
})

// legacy endpoints kept for compatibility
router.post('/addmenu', jwtAuthMiddleware, roleCheck(["admin", "manager"]), async (req, res) => {
	try {
		const { name, price, availableForDelivery } = req.body;

		const item = await MenuItem.create({
			name,
			price,
			availableForDelivery,
		});

		res.status(201).json({
			message: 'Menu item added successfully',
			item,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Internal Server Error', message: error.message });
	}
});

router.put('/addmenu/:id', jwtAuthMiddleware, roleCheck(["admin", "manager"]), async (req, res) => {
	try {
		const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
		res.json(updated);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Internal Server Error', message: error.message });
	}
});

router.delete('/addmenu/:id', jwtAuthMiddleware, roleCheck(["admin"]), async (req, res) => {
	try {
		await MenuItem.findByIdAndDelete(req.params.id);
		res.json({ message: 'Menu item deleted' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Internal Server Error', message: error.message });
	}
});

module.exports = router;
