const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  floor: { type: Number, required: true },
  roomNumber: { type: Number, required: true },
  availability: { type: Number, default: 2 },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { collection: 'rooms' });

module.exports = mongoose.model("Room", RoomSchema);
