const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  status: { type: String, default: "new" },
  // New profile fields:
  dob: { type: Date }, // Storing date of birth as a Date
  bloodGroup: { type: String },
  gender: { type: String },
  nationality: { type: String },
  contactNumber: { type: String },
  altContact: { type: String },
  guardianName: { type: String },
  guardianContact: { type: String },
  permAddress: { type: String },
  corrAddress: { type: String },
  studentID: { type: String },
  course: { type: String },
  year: { type: String },
  department: { type: String },
  university: { type: String },
  hostelPreference: { type: String },
  medical: { type: String },
  allergies: { type: String },
  emergencyName: { type: String },
  emergencyContact: { type: String },
  insurance: { type: String },
  documents: { type: [String], default: [] } // Initialize documents as an empty array by default
}, { collection: 'user' }); // Explicitly set the collection name to 'user'

const User = mongoose.model('User', userSchema);
module.exports = User;
