import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "❌ No auth token found" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: "❌ User not found" });
    }

    // Check department and year only for room-related endpoints.
    // You can adjust the condition based on your route structure.
    if (req.originalUrl.includes("/room") || req.originalUrl.includes("/room-requests")) {
      if (!user.department || !user.year) {
        return res.status(400).json({ message: "❌ Department and year info missing from user profile" });
      }
    }

    // Add user to request object
    req.user = user;


    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: "❌ Invalid auth token" });
  }
};

export default authMiddleware;
