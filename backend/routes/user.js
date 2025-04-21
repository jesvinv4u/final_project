import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/user.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "❌ Access denied" });
    }
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching users", error: error.message });
  }
});

// GET /me - Get user profile (protected route)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // ✅ Fetch user using `userId` from token
    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "❌ Server Error" });
  }
});

// PUT /:id/complete-profile - Update user profile
router.put('/:id/complete-profile',async (req, res) => {
  try {
    console.log("PUT /complete-profile called with id:", req.params.id);
    console.log("Request body:", req.body);

    // Build the updatedFields object including all fields
    const updatedFields = { ...req.body, status: "old", profileCompleted: true };

    // Convert fields if necessary (e.g., year should be a number, dob to a Date)
    if (updatedFields.year) {
      updatedFields.year = Number(updatedFields.year);
    }
    if (updatedFields.dob) {
      updatedFields.dob = new Date(updatedFields.dob);
    }

    // Update the user document with all fields from the request
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      console.log("User not found for id:", req.params.id);
      return res.status(404).json({ message: "❌ User not found" });
    }

    console.log("Updated user:", updatedUser);
    res.json({
      message: "✅ Profile updated successfully!",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
});

export default router;
