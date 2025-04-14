import mongoose from "mongoose";

const VacateTicketSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String },
    department: { type: String },
    year: { type: Number },
    roomNumber: { type: Number },
    floor: { type: Number },
    when: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["Pending", "Approved", "Rejected", "Completed"], 
      default: "Pending" 
    },
  },
  { timestamps: true }
);

const VacateTicket = mongoose.models.VacateTicket || mongoose.model("VacateTicket", VacateTicketSchema);
export default VacateTicket;