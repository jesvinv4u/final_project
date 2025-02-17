import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, default: 'new' },
  isAdmin: { type: Boolean, default: false },
  profileCompleted: { type: Boolean, default: false },
  documents: [{ type: mongoose.Schema.Types.ObjectId }],
  createdAt: { type: Date, default: Date.now }
}, { collection: 'user' });

const User = mongoose.model('User', userSchema);

export default User;
