import express from "express";
import Room from "../models/Room.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST endpoint to auto-assign a room (allowing multiple occupants using bookedBy array)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { id: userId, department, year } = req.user;
    const userIdStr = String(userId);
    console.log("Booking request from user:", userIdStr);
    console.log(department, year);

    // Check if the user already booked a room (bookedBy array contains the user id)
    const existingBooking = await Room.findOne({ bookedBy: userIdStr });
    if (existingBooking) {
      return res.status(400).json({ message: "❌ You have already booked a room." });
    }

    // Fetch all available rooms (with availability > 0)
    const availableRooms = await Room.find({ availability: { $gt: 0 } });
    if (!availableRooms || availableRooms.length === 0) {
      return res.status(400).json({ message: "❌ No rooms available" });
    }

    let candidate = null;

    // Helper functions to default department/year to empty arrays
    const getDepartmentArray = room => (room.department || []);
    const getYearArray = room => (room.year || []);

    // Priority 1: Room that already has occupants from the same department and year
    candidate = availableRooms.find(
      room => getDepartmentArray(room).includes(department) && getYearArray(room).includes(year)
    );
    // Priority 2: Room that has occupants from the same department only
    if (!candidate) {
      candidate = availableRooms.find(room => getDepartmentArray(room).includes(department));
    }
    // Priority 3: Room that has occupants with the same year only
    if (!candidate) {
      candidate = availableRooms.find(room => getYearArray(room).includes(year));
    }
    // Priority 4: Room that is entirely unassigned (empty department array)
    if (!candidate) {
      candidate = availableRooms.find(room => !room.department || room.department.length === 0);
    }
    // Fallback: Use the first available room if none matched the above
    if (!candidate) {
      candidate = availableRooms[0];
    }
  
    // Fail-safe: Return an error if candidate is not found
    if (!candidate) {
      return res.status(500).json({ message: "❌ No candidate room could be selected." });
    }
    
    // --- Option: Re-fetch candidate as a full Mongoose document ---
    candidate = await Room.findById(candidate._id);
    
    // Update candidate room details
    candidate.availability = candidate.availability - 1;
    
    // Defensive check: Ensure bookedBy, department, and year are arrays
    if (!Array.isArray(candidate.bookedBy)) candidate.bookedBy = [];
    if (!Array.isArray(candidate.department)) candidate.department = [];
    if (!Array.isArray(candidate.year)) candidate.year = [];
    console.log("candidate",candidate);
    
    // Now push the new booking details
    candidate.bookedBy.push(userIdStr);
    candidate.department.push(department);
    candidate.year.push(year);
    
    // Save the updated candidate room.
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

// GET endpoint to fetch the user's booked room, if any, by searching the bookedBy array
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const userIdStr = String(userId);
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