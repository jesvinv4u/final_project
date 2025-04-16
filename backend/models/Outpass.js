import mongoose from "mongoose";

const OutpassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    reason: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, default: "Pending" }
  },
  { collection: "outpasses" }
);

export default mongoose.model("Outpass", OutpassSchema);