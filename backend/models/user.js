import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, default: 'new' },
  documents: [{ type: mongoose.Schema.Types.ObjectId }],
  role:{ type: String, default: 'user'}
}, { collection: 'user' });

const User = mongoose.model('User', userSchema);

export default User;
