import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/user.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: '✅ User API is working!' });
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
router.put('/:id/complete-profile', async (req, res) => {
  try {
    console.log("PUT /complete-profile called with id:", req.params.id);
    console.log("Request body:", req.body);

    // Prevent the client from updating "status" by forcing it to "old"
    const { status, ...updatedFields } = req.body;

    // Attempt to update the user document
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { ...updatedFields, status: "old" },
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
