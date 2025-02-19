import mongoose from 'mongoose';

const Room_RequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  roomNumber: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
},{ collection: 'Room_Requests' });

const RoomReq = mongoose.model('Room_Requests', Room_RequestSchema);

export default RoomReq;
