const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json())

// import the router files
const userRoutes = require('./routes/userRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const staffRoutes = require('./routes/staffRoutes');
const tableRoutes = require('./routes/tableRoutes');

// use the routers
// Keep original mounts for backward compatibility
app.use('/user', userRoutes);
app.use('/table', tableRoutes);
app.use('/order', orderRoutes);
app.use('/reservation', reservationRoutes);

// Also expose namespaced API endpoints under /api/* to match frontend expectations
app.use('/api/user', userRoutes);
app.use('/api/table', tableRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/reservation', reservationRoutes);

app.listen(PORT, () => {
    console.log(`listening on the port ${PORT}`);
});