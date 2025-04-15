import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    floor: { type: Number, required: true },
    roomNumber: { type: Number, required: true },
    availability: { type: Number, default: 2 },
    bookedBy: { type: [String], default: []},
    department: { type: [String], default:[]  },
    year: { type: [Number], default:[] },
  },
  { collection: "rooms" }
);

export default mongoose.model("Room", RoomSchema);
