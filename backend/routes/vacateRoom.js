import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import VacateTicket from "../models/vacateticket.js";
import Room from "../models/Room.js";

const router = express.Router();

// POST endpoint to submit a vacate request
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { when, reason } = req.body;
    const { id: userId, name, department, year } = req.user;
    
    // Check if the user already has a pending vacate request
    const existingTicket = await VacateTicket.findOne({
      userId: String(userId),
      status: { $ne: "Completed" },
    });
    if (existingTicket) {
      return res.status(400).json({
        message: "❌ You already have a pending vacate request.",
      });
    }
    
    // Retrieve the room details for the user
    const room = await Room.findOne({ bookedBy: String(userId) });
    
    // Create a new vacate ticket with additional fields
    const ticket = await VacateTicket.create({
      userId: String(userId),
      name,                // from user profile
      department,          // from user profile
      year,                // from user profile
      roomNumber: room ? room.roomNumber : null, // from room record
      floor: room ? room.floor : null,           // from room record
      when,
      reason,
      status: "Pending",
    });
    
    return res.json({
      message: "✅ Vacate request submitted successfully!",
      ticket,
    });
  } catch (error) {
    console.error("Error submitting vacate request:", error);
    return res
      .status(500)
      .json({ message: "❌ Server error", error: error.message });
  }
});

// GET endpoint to fetch the user's active vacate request
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const ticket = await VacateTicket.findOne({
      userId: String(userId),
      status: { $ne: "Completed" },
    });
    if (ticket) {
      return res.json({ ticket });
    } else {
      return res
        .status(404)
        .json({ message: "No vacate request found for user." });
    }
  } catch (error) {
    console.error("Error fetching vacate request:", error);
    return res
      .status(500)
      .json({ message: "❌ Server error", error: error.message });
  }
});

export default router;