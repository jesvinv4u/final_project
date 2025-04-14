import express from "express";
import VacateTicket from "../models/vacateticket.js";
import Room from "../models/Room.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// GET endpoint: Fetch all vacate tickets for admin review
router.get("/", adminAuthMiddleware, async (req, res) => {
  try {
    const tickets = await VacateTicket.find().sort({ createdAt: -1 });
    return res.json({ tickets });
  } catch (error) {
    console.error("Error fetching vacate tickets:", error);
    return res.status(500).json({ message: "❌ Internal server error", error: error.message });
  }
});

// PUT endpoint: Update a vacate ticket's status and update the room and user (if approved)
router.put("/:ticketId", adminAuthMiddleware, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body; // Expected values: "approved" or "rejected"
    
    // Update the vacate ticket's status
    const ticket = await VacateTicket.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ message: "Vacate ticket not found." });
    }
    
    // If approved, update the Room document to vacate the room for the specific occupant
    if (status === "approved") {
      // Update the room by clearing bookedBy, department and year and incrementing availability
      const room = await Room.findOneAndUpdate(
        { bookedBy: ticket.userId },
        {
          bookedBy: null,
          department: null,
          year: null,
          $inc: { availability: 1 }
        },
        { new: true }
      );
      
      return res.json({
        message: "✅ Vacate request approved, room vacated and booking details cleared!",
        ticket,
        room,
      });
    }
    
    // For rejected (or other statuses) return only the ticket update
    return res.json({
      message: `Vacate request ${status}.`,
      ticket,
    });
    
  } catch (error) {
    console.error("Error updating vacate ticket:", error);
    return res.status(500).json({ message: "❌ Internal server error", error: error.message });
  }
});

export default router;