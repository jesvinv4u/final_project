import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, default: 'new' },
  documents: [{ type: mongoose.Schema.Types.ObjectId }],
  role: { type: String, default: 'user' },
  // Personal Details
  dob: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  nationality: { type: String },
  contactNumber: { type: String },
  // Guardian Details
  guardianName: { type: String },
  guardianContact: { type: String },
  permAddress: { type: String },
  // Academic Details
  studentID: { type: String },
  course: { type: String },
  department: { type: String },
  year: { type: Number },
  // Emergency Details
  bloodGroup: { type: String },
  medical: { type: String },
  emergencyContact: { type: String }
}, { collection: 'user' });

const User = mongoose.model('User', userSchema);

export default User;
