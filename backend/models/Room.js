import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    floor: { type: Number, required: true },
    roomNumber: { type: Number, required: true },
    availability: { type: Number, default: 2 },
    bookedBy: { type: String, default: null }, // Changed from ObjectId to String
  },
  { collection: "rooms" }
);

export default mongoose.model("Room", RoomSchema);
