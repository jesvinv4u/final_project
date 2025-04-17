import express from "express";
import Room from "../models/Room.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const availableRooms = await Room.find({ availability: { $gt: 0 } });
    if (!availableRooms || availableRooms.length === 0) {
      return res.status(404).json({ message: "No rooms with availability greater than 0 found" });
    }
    return res.json({ rooms: availableRooms });
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    return res.status(500).json({ message: "❌ Server error", error: error.message });
  }
});

export default router;///