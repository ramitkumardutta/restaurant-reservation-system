const express = require('express');
const router = express.Router();

const Table = require('./../models/table');
const { jwtAuthMiddleware } = require('./../middleware/jwt');
const roleCheck = require('./../middleware/roleCheck');

router.post('/addtables', jwtAuthMiddleware, roleCheck(["admin"]), async (req, res) => {
    try {
        const { tableNumber, capacity } = req.body;

        if(!tableNumber || !capacity) {
            return res.status(400).json({
                message: "tableNumber and Capacity are Required"
            });
        }

        // prevent duplicate
        const exists = await Table.findOne({ tableNumber });
        if(exists) {
            return res.status(409).json({
                message: "Table with This number alreadt exists"
            });
        }

        const table = await Table.create({
            tableNumber,
            capacity,
            isActive: true
        });

        res.status(201).json({
            message: "Table added Successfully",
            table
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
});

// RESTful list endpoint
router.get('/', jwtAuthMiddleware, roleCheck(["admin", "manager"]), async (req, res) => {
    try {
        const tables = await Table.find().sort({ tableNumber: 1});
        res.json(tables);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
});

// RESTful create endpoint
router.post('/', jwtAuthMiddleware, roleCheck(["admin"]), async (req, res) => {
    try {
        const { tableNumber, capacity } = req.body;

        if(!tableNumber || !capacity) {
            return res.status(400).json({ message: "tableNumber and Capacity are Required" });
        }

        const exists = await Table.findOne({ tableNumber });
        if(exists) {
            return res.status(409).json({ message: "Table with This number already exists" });
        }

        const table = await Table.create({ tableNumber, capacity, isActive: true });
        res.status(201).json({ message: "Table added Successfully", table });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
});

// legacy viewtables kept for compatibility
router.get('/viewtables', jwtAuthMiddleware, roleCheck(["admin", "manager"]), async (req, res) => {
    const tables = await Table.find().sort({ tableNumber: 1});
    res.json(tables);
});

module.exports = router;