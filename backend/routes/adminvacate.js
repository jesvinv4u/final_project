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
      // Update the room by removing only the vacating user from the bookedBy, department, and year arrays,
      // and incrementing the availability by 1.
      const room = await Room.findOneAndUpdate(
        { bookedBy: ticket.userId },
        {
          $pull: {
            bookedBy: ticket.userId,
            department: ticket.department,  // Ensure ticket.department exists or adjust accordingly.
            year: ticket.year               // Ensure ticket.year exists or adjust accordingly.
          },
          $inc: { availability: 1 }
        },
        { new: true }
      );
      
      return res.json({
        message: "✅ Vacate request approved, occupant removed and room updated!",
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