import express from "express";
import Complaint from "../models/Complaint.js";

const router = express.Router();

// POST route to submit a complaint
router.post("/", async (req, res) => {
  try {
    const { complaintType, problem, name,roomNumber, email } = req.body;

    // Validate required fields
    if (!complaintType || !problem || !name || !roomNumber || !email) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new complaint
    const newComplaint = new Complaint({
      complaintType,
      problem,
      name,
      roomNumber,
      email,
    });

    // Save the complaint to the database
    await newComplaint.save();

    res.status(201).json({ message: "Complaint submitted successfully!" });
  } catch (error) {
    console.error("Error submitting complaint:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// GET route to fetch all complaints (optional, for admin use)
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// PUT route to update complaint status (optional, for admin use)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    // Update the complaint status
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    res.status(200).json({ message: "Complaint status updated successfully!", complaint: updatedComplaint });
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

export default router;