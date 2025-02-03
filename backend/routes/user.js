const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/user');
const router = express.Router();

// Get user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: '❌ Server Error' });
  }
});

module.exports = router;
