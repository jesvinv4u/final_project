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

// ✅ Book a Room (Auto-assignment based on user profile)
router.post("/book", authMiddleware, async (req, res) => {
  try {
    // Assume req.user contains department and year fields
    const { department, year, id: userId } = req.user;

    // Check if user has already booked a room
    const existingBooking = await Room.findOne({ bookedBy: userId });
    if (existingBooking) {
      return res.status(400).json({
        message: `❌ You have already booked Room ${existingBooking.roomNumber} on Floor ${existingBooking.floor}!`,
      });
    }

    // Fetch all rooms with available capacity
    const availableRooms = await Room.find({ availability: { $gt: 0 } });
    if (availableRooms.length === 0) {
      return res.status(400).json({ message: "❌ No rooms available" });
    }

    let candidate;

    // Priority 1: Same department & year
    candidate = availableRooms.find(room => room.department === department && room.year === year);
    if (candidate) {
      candidate.availability -= 1;
      candidate.bookedBy = userId;
      candidate.department = department;
      candidate.year = year;
      await candidate.save();
      return res.json({
        message: `✅ Room ${candidate.roomNumber} auto-assigned based on your profile (same department & year).`,
        room: candidate,
      });
    }

    // Priority 2: Same department
    candidate = availableRooms.find(room => room.department === department);
    if (candidate) {
      candidate.availability -= 1;
      candidate.bookedBy = userId;
      candidate.department = department;
      candidate.year = year;
      await candidate.save();
      return res.json({
        message: `✅ Room ${candidate.roomNumber} auto-assigned based on your profile (same department).`,
        room: candidate,
      });
    }

    // Priority 3: Same year
    candidate = availableRooms.find(room => room.year === year);
    if (candidate) {
      candidate.availability -= 1;
      candidate.bookedBy = userId;
      candidate.department = department;
      candidate.year = year;
      await candidate.save();
      return res.json({
        message: `✅ Room ${candidate.roomNumber} auto-assigned based on your profile (same year).`,
        room: candidate,
      });
    }

    // Priority 4: Empty room (not yet assigned a department)
    candidate = availableRooms.find(room => !room.department);
    if (candidate) {
      candidate.availability -= 1;
      candidate.bookedBy = userId;
      candidate.department = department;
      candidate.year = year;
      await candidate.save();
      return res.json({
        message: `✅ Room ${candidate.roomNumber} auto-assigned from an empty room.`,
        room: candidate,
      });
    }

    // Priority 5: Fallback - nearest to an ideal match
    // In this step we create a union of target rooms based on priorities 1-3
    // and then choose the available candidate whose roomNumber is nearest to any target room.
    let targetRooms = availableRooms.filter(
      room => room.department === department || room.year === year
    );
    let targetNumbers = targetRooms.map(room => room.roomNumber);

    let minDistance = Infinity;
    candidate = null;
    availableRooms.forEach(room => {
      targetNumbers.forEach(targetNum => {
        const distance = Math.abs(room.roomNumber - targetNum);
        if (distance < minDistance) {
          minDistance = distance;
          candidate = room;
        }
      });
    });

    if (candidate) {
      candidate.availability -= 1;
      candidate.bookedBy = userId;
      candidate.department = department;
      candidate.year = year;
      await candidate.save();
      return res.json({
        message: `✅ Room ${candidate.roomNumber} auto-assigned as a fallback option.`,
        room: candidate,
      });
    }

    return res.status(400).json({ message: "❌ No available rooms found." });
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
