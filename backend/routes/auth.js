const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Admin = require('../models/admin'); // ✅ Import admin model
require('dotenv').config();

const router = express.Router();

// ✅ Public Route: Check If Auth API is Working
router.get('/', (req, res) => {
  res.json({ message: '✅ Auth API is working!' });
});

// ✅ User/Admin Registration Route
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // ✅ Validate Required Fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: '❌ All fields (name, email, password) are required' });
    }

    // ✅ Ensure Password is Strong Enough
    if (password.length < 6) {
      return res.status(400).json({ message: '❌ Password must be at least 6 characters long' });
    }

    // ✅ Check if email already exists in both collections
    const existingUser = await User.findOne({ email });
    const existingAdmin = await Admin.findOne({ email });

    if (existingUser || existingAdmin) {
      return res.status(400).json({ message: '❌ User/Admin with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Set Default Role
    const userRole = role?.toLowerCase() || 'user'; // Default to "user" if no role is provided

    // ✅ Validate Role
    if (!['admin', 'user'].includes(userRole)) {
      return res.status(400).json({ message: '❌ Invalid role. Allowed roles: admin, user' });
    }

    let newAccount;
    if (userRole === 'admin') {
      newAccount = new Admin({ name, email, password: hashedPassword, role: 'admin' });
    } else {
      newAccount = new User({ name, email, password: hashedPassword, role: 'user' });
    }

    await newAccount.save();

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: newAccount._id, role: userRole },
      process.env.JWT_SECRET || "fallback_secret", // ✅ Use fallback secret to prevent crashes
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // ✅ Return Success Response with Token
    res.status(201).json({
      message: `✅ ${userRole === 'admin' ? 'Admin' : 'User'} Registered Successfully`,
      user: { id: newAccount._id, name, email, role: userRole },
      token
    });

  } catch (err) {
    console.error('❌ Server Error:', err.message);
    res.status(500).json({ message: `❌ Server Error: ${err.message}` });
  }
});

// ✅ User/Admin Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ Check if user/admin exists
    const user = await User.findOne({ email }) || await Admin.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "❌ Invalid email or password" });
    }

    // ✅ Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "❌ Invalid email or password" });
    }

    // ✅ Generate JWT Token
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
        role: user.role
      }
    });

  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ message: "❌ Server error" });
  }
});

module.exports = router;
