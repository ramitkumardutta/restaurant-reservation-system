const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const { jwtAuthMiddleware, generateToken } = require('./../middleware/jwt.js');
const Reservation = require('./../models/reservation.js');
const Table = require('./../models/table.js');
const Notification = require('./../models/notification.js');

router.post('/signup', async (req, res) => {
    try {
        const data = req.body;

        const { role } = data;

        if(role === 'admin') {
            const adminExists = await User.exists({ role: 'admin'});

            if(adminExists) {
                return res.status(403).json({
                    message: 'An Admin already exists. You cannot sign up as admin.'
                });
            }
        }

        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

        const phoneRegex = /^[6-9]\d{9}$/;

        if(!emailRegex.test(data.email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        if(!phoneRegex.test(data.phone)) {
            return res.status(400).json({
                message: "Invalid phone number"
            });
        }

        const newUser = new User(data);

        await newUser.validate();

        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: newUser._id,
            role: newUser.role
        }

        const token = generateToken(payload);
        console.log("Token is : ", token);

        const userData = newUser.toObject();

        res.status(200).json({
            user: userData,
            token: token
        });
    } catch (err) {
        console.error(err);

        // Mongoose validation error
        if (err && err.name === 'ValidationError') {
            return res.status(400).json({ error: 'ValidationError', details: err.message });
        }

        // Duplicate key error
        if (err && err.code === 11000) {
            return res.status(400).json({ error: 'DuplicateKey', details: err.keyValue });
        }

        // MongoDB server-side schema validation error (code 121)
        if (err && (err.code === 121 || err.name === 'MongoServerError')) {
            const details = err.errorResponse?.errInfo?.details || err.errInfo?.details || err.message;
            return res.status(400).json({ error: 'MongoServerValidation', details });
        }

        // Fallback
        res.status(500).json({error: 'Internal Server Error', message: err && err.message});
    }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const payload = {
      id: user._id,
      role: user.role
    };

    const token = generateToken(payload);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/reservation', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingType, peopleCount, startTime } = req.body;

    if (!startTime || !peopleCount) {
      return res.status(400).json({
        message: "StartTime and peopleCount are required"
      });
    }

    const finalPeopleCount = bookingType === "couple" ? 2 : peopleCount;

    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
        return res.status(400).json({
            message: "Invalid startTime format."
        });
    }

    // validate future time
    const now = new Date();
    if (start <= now) {
        return res.status(400).json({
            message: "Invalid date and time. Booking must be in the future."
        });
    }
    const end = new Date(start.getTime() + 45 * 60 * 1000);


    let tables;

    if (bookingType === 'couple') {
      tables = await Table.find({ capacity: 2, isActive: true });
    } else {
      tables = await Table.find({
        capacity: { $gte: finalPeopleCount },
        isActive: true
      }).sort({ capacity: 1 });
    }

    if (!tables.length) {
      return res.status(409).json({
        message: "No suitable table available"
      });
    }

    let selectedTable = null;

    for (const table of tables) {
      const conflict = await Reservation.findOne({
        tableId: table._id,
        startTime: { $lt: end },
        endTime: { $gt: start }
      });

      if (!conflict) {
        selectedTable = table;
        break;
      }
    }

    if (!selectedTable) {
      return res.status(409).json({
        message: "No table available for this time slot. Try a different time."
      });
    }

    const reservation = await Reservation.create({
      userId,
      tableId: selectedTable._id,
      bookingType,
      peopleCount: finalPeopleCount,
      startTime: start,
      endTime: end
    });

    await Notification.create({
        userId,
        message: `Your reservation for ${finalPeopleCount} people has been successfully confirmed from ${start.toLocaleTimeString()} to ${end.toLocaleTimeString()} on ${start.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })}. Your table number is ${selectedTable.tableNumber}.`
    });

    res.status(201).json({
      message: "Reservation successful",
      reservation: {
        reservationId: reservation._id,
        tableNumber: selectedTable.tableNumber,
        startTime: start,
        endTime: end
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
});


// router.get('/', async(req, res) => {
//     try {
        
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// })

router.get('/me', jwtAuthMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
})

router.get('/myreservations', jwtAuthMiddleware, async(req, res) => {
    try {
        const userId = req.user.id;
    const reservations = await Reservation.find({ userId })
      .populate('tableId', 'tableNumber capacity')
      .sort({ startTime: -1 });

    res.status(200).json({
      count: reservations.length,
      reservations
    });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
})

module.exports = router;