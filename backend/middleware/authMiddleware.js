import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Admin from '../models/admin.js';

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "❌ No auth token found" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If route is for admin, check the Admin collection.
    // (No condition was written, so we assume this part is not implemented yet)

    // Otherwise, check in the User collection.
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: "❌ User not found" });
    } else {
      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        return res.status(401).json({ message: "❌ Admin not found" });
      }
      req.admin = admin;
    }

    // For room-related endpoints, check for additional info.
    if (req.originalUrl.includes("/room") || req.originalUrl.includes("/room-requests")) {
      if (!user.department || !user.year) {
        return res.status(400).json({ message: "❌ Department and year info missing from user profile" });
      }
    }

    req.user = user;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: "❌ Invalid auth token" });
  }
};

export default authMiddleware;
