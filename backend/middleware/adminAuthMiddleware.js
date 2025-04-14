import jwt from 'jsonwebtoken';

const adminAuthMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "❌ No auth token found" });
    }
    
    // Verify token signature. Since you don't have admin users in the database,
    // we don't need to look up a user record.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Optionally, store decoded info for later use
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(401).json({ message: "❌ Invalid auth token" });
  }
};

export default adminAuthMiddleware;