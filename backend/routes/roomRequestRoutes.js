// routes/roomRequestRoutes.js
import express from "express";
import RoomRequest from "../models/RoomRequest.js";
import Room from "../models/Room.js"; // Import the Room model

const router = express.Router();

// Submit a room booking request
router.post("/submit-request", async (req, res) => {
  try {
    const { name, email, floor, roomNumber, date, time } = req.body;
    const newRequest = new RoomRequest({
      name,
      email,
      floor,
      roomNumber,
      date,
            status: "Pending",
    });
    await newRequest.save();
    res.status(201).json({ message: "Booking request submitted successfully!", request: newRequest });
  } catch (error) {
    res.status(500).json({ message: "Error submitting booking request", error: error.message });
  }
});

// Fetch all room requests for admin
router.get("/requests", async (req, res) => {
  try {
    const requests = await RoomRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking requests", error: error.message });
  }
});

// Update request status (Approve/Reject)
// When a request is approved, update the Room collection accordingly
router.put("/update-request/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the request
    const request = await RoomRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found!" });
    }

    // Update the request status
    request.status = status;
    await request.save();

    // If the request is approved, update the Room collection
    if (status === "Approved") {
      const { floor, roomNumber } = request;

      // Find the room in the Room collection
      const room = await Room.findOne({ floor, roomNumber });
      if (!room) {
        return res.status(404).json({ message: "Room not found!" });
      }

      // Check if the room is already booked
      if (room.availability === 0) {
        return res.status(400).json({ message: "Room is already booked!" });
      }

      // Update room availability and assign the user
      room.availability -= 1;
      room.bookedBy = request._id; // Assuming email is used as the user identifier
      await room.save();
    }

    res.status(200).json({ message: "Request status updated successfully!", request });
  } catch (error) {
    res.status(500).json({ message: "Error updating request status", error: error.message });
  }
});

export default router;