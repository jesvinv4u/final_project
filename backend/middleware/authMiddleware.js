const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "❌ No token provided. Unauthorized request." });
  }

  const token = authHeader.split(" ")[1]; // ✅ Extract token after "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Verify token
    req.user = { id: decoded.id }; // ✅ Extract user ID from decoded token
    next();
  } catch (error) {
    return res.status(401).json({ message: "❌ Invalid or expired token." });
  }
};

module.exports = authMiddleware;
