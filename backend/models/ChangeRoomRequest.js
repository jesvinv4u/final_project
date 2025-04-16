import mongoose from "mongoose";

const ChangeRoomRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    currentRoom: { type: Number, required: true },
    desiredRoom: { type: Number, required: true },
    reason: { type: String, required: true },
    block: { type: String }, // optional; add if available in profile
    status: { type: String, default: "Pending" },
    date: { type: String, required: true },
    time: { type: String, required: true },
  },
  { collection: "changeroomrequests" }
);

export default mongoose.model("ChangeRoomRequest", ChangeRoomRequestSchema);