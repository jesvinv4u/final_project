import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    complaintType: { type: String, required: true }, // e.g., "Room Issues"
    problem: { type: String, required: true }, // e.g., "AC/Fan not working" or user input
    name: { type: String, required: true }, // User's name
    roomNumber: { type: Number, required: true },
    email: { type: String, required: true }, // User's email
    status: { type: String, default: "Pending" }, // Complaint status (e.g., Pending, Resolved)
    createdAt: { type: Date, default: Date.now }, // Timestamp for when the complaint was created
  },
  { collection: "complaints" }
);

export default mongoose.model("Complaint", ComplaintSchema);