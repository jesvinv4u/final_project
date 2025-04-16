import express from "express";
import ChangeRoomRequest from "../models/ChangeRoomRequest.js";

const router = express.Router();

// POST: Create a new change room request ticket
router.post("/create", async (req, res) => {
  try {
    const {
      name,
      email,
      contactNumber,
      currentRoom,
      desiredRoom,
      reason,
      block, // optional
      date,
      time,
      status
    } = req.body;

    // Ensure required fields are present
    if (!name || !email || !contactNumber || !currentRoom || !desiredRoom || !reason || !date || !time) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const newTicket = new ChangeRoomRequest({
      name,
      email,
      contactNumber,
      currentRoom,
      desiredRoom,
      reason,
      block,
      date,
      time,
      status, // defaults to Pending if not provided
    });

    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    console.error("Error creating room change ticket:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// GET: Retrieve all change room request tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await ChangeRoomRequest.find();
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching room change tickets:", error);
    res.status(500).json({ message: "Failed to retrieve tickets. Please try again later." });
  }
});

// PUT: Update a change room request ticket (e.g., approve or reject)
router.put("/update/:id", async (req, res) => {
  try {
    const { status } = req.body;
    // Validate status field if needed

    const ticket = await ChangeRoomRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error updating room change ticket:", error);
    res.status(500).json({ message: "Failed to update ticket. Please try again later." });
  }
});

export default router;