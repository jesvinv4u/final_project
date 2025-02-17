const express = require("express");
const Room = require("../models/Room");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// ✅ Initialize Rooms (Run Only Once)
router.post("/init", async (req, res) => {
  try {
    const floors = [1, 2, 3, 4, 5];
    const roomsPerFloor = 20;

    for (let floor of floors) {
      for (let roomNumber = 1; roomNumber <= roomsPerFloor; roomNumber++) {
        const room = new Room({ floor, roomNumber });
        await room.save();
      }
    }

    res.json({ message: "✅ Rooms initialized successfully!" });
  } catch (err) {
    res.status(500).json({ message: "❌ Server Error", error: err.message });
  }
});

// ✅ Get All Available Rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "❌ Server Error", error: err.message });
  }
});

// ✅ Book a Room (Ensuring User Can Only Book Once)
router.post("/book", authMiddleware, async (req, res) => {
  try {
    const { floor, roomNumber } = req.body;
    const userId = req.user.id;

    // ✅ Check if user has already booked a room in any floor
    const existingBooking = await Room.findOne({ bookedBy: userId });

    if (existingBooking) {
      return res.status(400).json({
        message: `❌ You have already booked Room ${existingBooking.roomNumber} on Floor ${existingBooking.floor}!`,
      });
    }

    // ✅ Find the room the user wants to book
    const room = await Room.findOne({ floor, roomNumber });

    if (!room) {
      return res.status(404).json({ message: "❌ Room not found!" });
    }

    if (room.availability === 0) {
      return res.status(400).json({ message: "❌ Room is unavailable!" });
    }

    // ✅ Update room availability and assign the user
    room.availability -= 1;
    room.bookedBy = userId;
    await room.save();

    res.json({ message: `✅ Room ${roomNumber} on Floor ${floor} booked successfully!`, room });
  } catch (err) {
    res.status(500).json({ message: "❌ Server Error", error: err.message });
  }
});

router.post("/vacate", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Check if user has a booked room
    const bookedRoom = await Room.findOne({ bookedBy: userId });

    if (!bookedRoom) {
      return res.status(400).json({ message: "❌ You do not have a booked room to vacate!" });
    }

    // ✅ Update room to make it available again
    bookedRoom.availability = 2; // Fully available
    bookedRoom.bookedBy = null;
    await bookedRoom.save();

    res.json({ message: `✅ Room ${bookedRoom.roomNumber} on Floor ${bookedRoom.floor} has been vacated successfully!` });
  } catch (err) {
    res.status(500).json({ message: "❌ Server Error", error: err.message });
  }
});

router.get("/vacate-requests", async (req, res) => {
  try {
    const vacateRequests = await Room.find({ bookedBy: { $ne: null } }).populate("bookedBy", "name email");
    res.json(vacateRequests);
  } catch (err) {
    res.status(500).json({ message: "❌ Server Error", error: err.message });
  }
});



module.exports = router;
