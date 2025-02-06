const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Admin = require('../models/admin');
require('dotenv').config();

const router = express.Router();

// ✅ Public Route: Check If Auth API is Working
router.get('/', (req, res) => {
  res.json({ message: '✅ Auth API is working!' });
});

// ✅ User Registration Route (Admins are NOT allowed to register here)
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: '❌ All fields (name, email, password) are required' });
    }

    const emailLower = email.toLowerCase();
    const existingUser = await User.findOne({ email: emailLower });

    if (existingUser) {
      return res.status(400).json({ message: '❌ User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email: emailLower,
      password: hashedPassword,
      role: 'user',
      status: "new" // ✅ Set status as "new" for fresh users
    });

    await newUser.save();

    res.status(201).json({
      message: "✅ User Registered Successfully",
      user: { id: newUser._id, name, email: emailLower, role: "user", status: "new" }
    });

  } catch (err) {
    console.error('❌ Server Error:', err.message);
    res.status(500).json({ message: `❌ Server Error: ${err.message}` });
  }
});


// ✅ User/Admin Login Route (Admins are added manually but can log in)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const emailLower = email.toLowerCase();
    const user = await User.findOne({ email: emailLower }) || await Admin.findOne({ email: emailLower });

    if (!user) {
      return res.status(400).json({ message: "❌ Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "❌ Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1h" }
    );

    res.json({
      message: "✅ Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status // ✅ Include status to decide redirection
      }
    });

  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ message: "❌ Server error" });
  }
});


module.exports = router;
