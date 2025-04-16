import express from "express";
import Outpass from "../models/Outpass.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST: Create a new outpass request
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name, email, contactNumber, reason, date, time } = req.body;

    // Validate required fields
    if (!name || !email || !contactNumber || !reason || !date || !time) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const newOutpass = new Outpass({
      name,
      email,
      contactNumber,
      reason,
      date,
      time
    });
    
    await newOutpass.save();
    return res.status(201).json(newOutpass);
  } catch (error) {
    console.error("Error creating outpass:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET: Fetch all outpass requests (optionally for admin review)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const outpasses = await Outpass.find();
    return res.json(outpasses);
  } catch (error) {
    console.error("Error fetching outpasses:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;