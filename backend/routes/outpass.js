import express from "express";
import Outpass from "../models/Outpass.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST: Create a new outpass ticket
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = String(req.user.id);
    const { name, year, roomNumber, reason, checkIn, checkOut } = req.body;

    if (!name || !year || !roomNumber || !reason || !checkIn || !checkOut) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }
    const newOutpass = new Outpass({ userId,name, year, roomNumber, reason, checkIn, checkOut });
    await newOutpass.save();

    res.status(201).json(newOutpass);
  } catch (error) {
    console.error("Error creating outpass:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET: Fetch all outpass requests (optionally for admin review)
router.get("/", async (req, res) => {
  try {
    const outpasses = await Outpass.find();
    return res.json(outpasses);
  } catch (error) {
    console.error("Error fetching outpasses:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:userid", authMiddleware, async (req, res) => {
  try {
    const outpasses = await Outpass.find({ userId: req.params.userid });
    return res.json(outpasses);
  } catch (error) {
    console.error("Error fetching outpasses:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;