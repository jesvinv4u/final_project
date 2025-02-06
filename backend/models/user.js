const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  status: { type: String, default: "new" }
}, { collection: 'user' }); // ✅ Explicitly set collection name to 'user'

const User = mongoose.model('User', userSchema);
module.exports = User;
