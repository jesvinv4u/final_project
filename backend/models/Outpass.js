import mongoose from "mongoose";

const OutpassSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  year: { type: String, required: true },
  roomNumber: { type: String, required: true },
  reason: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true }
}, 
{ timestamps: true }); // Adds createdAt and updatedAt automatically

const Outpass = mongoose.model("Outpass", OutpassSchema);
export default Outpass;