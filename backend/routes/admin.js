import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Public Admin Route (Test if API Works)
router.get('/', (req, res) => {
  res.json({ message: '✅ Admin API is working!' });
});

// ✅ Protected Admin Dashboard Route
router.get('/dashboard', authMiddleware, async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: '❌ Access Denied: Admins only' });
  }
  res.json({ message: '✅ Welcome to the Admin Dashboard' });
});

export default router;
