import express from "express";
import Room from "../models/Room.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST endpoint to auto-assign a room
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { id: userId, department, year } = req.user;
    const userIdStr = String(userId);
    console.log("Booking request from user:", userIdStr);

    // Check if the user already booked a room
    const existingBooking = await Room.findOne({ bookedBy: userIdStr });
    if (existingBooking) {
      return res.status(400).json({ message: "❌ You have already booked a room." });
    }

    // Fetch all available rooms (with availability greater than 0)
    const availableRooms = await Room.find({ availability: { $gt: 0 } });
    if (!availableRooms || availableRooms.length === 0) {
      return res.status(400).json({ message: "❌ No rooms available" });
    }

    let candidate = null;

    // Priority 1: Room that matches both department and year
    candidate = availableRooms.find(
      room => room.department === department && room.year === year
    );

    // Priority 2: Room that matches department only
    if (!candidate) {
      candidate = availableRooms.find(room => room.department === department);
    }

    // Priority 3: Room that matches year only
    if (!candidate) {
      candidate = availableRooms.find(room => room.year === year);
    }

    // Priority 4: Room that is entirely unassigned (no department)
    if (!candidate) {
      candidate = availableRooms.find(room => !room.department);
    }

    // Fallback: Use the first available room
    if (!candidate) {
      candidate = availableRooms[0];
    }

    // Update candidate room details
    candidate.availability = candidate.availability - 1;
    candidate.bookedBy = userIdStr; // store as string per Room schema
    // If the room is unassigned, assign user's department and year
    if (!candidate.department) candidate.department = department;
    if (!candidate.year) candidate.year = year;

    await candidate.save();

    console.log("Room booked successfully:", candidate);
    return res.json({
      message: `✅ Room ${candidate.roomNumber} auto-assigned successfully!`,
      room: candidate
    });
  } catch (error) {
    console.error("Error booking room:", error);
    return res.status(500).json({ message: "❌ Server error", error: error.message });
  }
});

// GET endpoint to fetch the user's booked room, if any
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const userIdStr = String(userId);
    console.log("🔍 GET route user ID:", userIdStr);

    const existingBooking = await Room.findOne({ bookedBy: userIdStr });
    if (existingBooking) {
      return res.json({ room: existingBooking });
    } else {
      return res.status(404).json({ message: "No booking found for user." });
    }
  } catch (error) {
    console.error("Error fetching booking:", error);
    return res.status(500).json({ message: "❌ Server error", error: error.message });
  }
});

export default router;