// routes/roomRequestRoutes.js
import express from "express";
import RoomRequest from "../models/RoomRequest.js";
import Room from "../models/Room.js"; // Import the Room model

const router = express.Router();

// Submit a room booking request
router.post("/submit-request", async (req, res) => {
  try {
    // Removed floor and roomNumber; now expecting department and year from the user profile
    const { name, email, department, year, date, time,userId } = req.body;
    const newRequest = new RoomRequest({
      name,
      email,
      department,
      year,
      date,
      time,
      userId,
      status: "Pending",
    });
    await newRequest.save();
    res.status(201).json({
      message: "Booking request submitted successfully!",
      request: newRequest,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting booking request", error: error.message });
  }
});

// Fetch all room requests for admin
router.get("/requests", async (req, res) => {
  try {
    const requests = await RoomRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching booking requests", error: error.message });
  }
});

// Update request status (Approve/Reject)
// When a request is approved, update the Room collection with auto‑assignment logic
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

    // If the request is approved, auto assign a room based on the applicant's profile
    if (status === "Approved") {
      // Auto‑assignment priorities based on department and year
      const { department, year } = request;

      // Fetch all rooms with available capacity
      const availableRooms = await Room.find({ availability: { $gt: 0 } });
      if (availableRooms.length === 0) {
        return res.status(400).json({ message: "No rooms available for auto-assignment!" });
      }

      let candidate = null;

      // Priority 1: Same department & year
      candidate = availableRooms.find(
        (room) => room.department === department && room.year === year
      );

      // Priority 2: Same department
      if (!candidate) {
        candidate = availableRooms.find((room) => room.department === department);
      }

      // Priority 3: Same year
      if (!candidate) {
        candidate = availableRooms.find((room) => room.year === year);
      }

      // Priority 4: Empty room (room not yet assigned a department)
      if (!candidate) {
        candidate = availableRooms.find((room) => !room.department);
      }

      // Priority 5: Fallback - nearest to ideal match
      if (!candidate) {
        // Build target collection based on department and year match if available
        let targetNumbers = availableRooms
          .filter(
            (room) => room.department === department || room.year === year
          )
          .map((room) => room.roomNumber);

        let minDistance = Infinity;
        availableRooms.forEach((room) => {
          targetNumbers.forEach((targetNum) => {
            const distance = Math.abs(room.roomNumber - targetNum);
            if (distance < minDistance) {
              minDistance = distance;
              candidate = room;
            }
          });
        });
      }

      if (!candidate) {
        return res.status(400).json({ message: "Unable to auto-assign a room" });
      }

      // Update room details for auto assignment: reduce availability & assign the requestor details
      candidate.availability -= 1;
      candidate.bookedBy = request.userId;      // Optionally update room profile if desired (only if room is unassigned)
      if (!candidate.department) candidate.department = department;
      if (!candidate.year) candidate.year = year;
      await candidate.save();

      return res.status(200).json({
        message: `Request approved and Room ${candidate.roomNumber} auto-assigned successfully!`,
        request,
        room: candidate,
      });
    }

    res.status(200).json({ message: "Request status updated successfully!", request });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating request status", error: error.message });
  }
});

export default router;