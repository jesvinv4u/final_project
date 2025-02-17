const express = require("express");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/user");
const router = express.Router();

const MONGO_URI = "mongodb://127.0.0.1:27017/Project";

// ✅ Fixed Storage Configuration
const storage = new GridFsStorage({
  url: MONGO_URI,
 
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // Let GridFS generate the _id automatically
      const fileInfo = {
        filename: file.originalname,  // Keep original filename
        bucketName: 'uploads',
        metadata: {
          uploadedBy: req.user?.id,  // Add user context
          originalname: file.originalname,
          mimetype: file.mimetype
        }
      };
      resolve(fileInfo);
    });
  }
});

const upload = multer({ storage });

// ✅ Fixed Upload Route
router.post("/", 
  authMiddleware,       // 1. Auth check first
  upload.array('documents', 5),  // 2. File upload
  async (req, res) => {  // 3. Handle business logic
    try {
      if (!req.files?.length) {
        return res.status(400).json({ message: "❌ No files uploaded" });
      }

      // Get MongoDB-generated file IDs
      const fileIds = req.files.map(file => file.id);

      // Update user document
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $push: { documents: { $each: fileIds } } },
        { new: true }
      );

      res.json({
        message: "✅ Files uploaded successfully!",
        files: req.files.map(file => ({
          id: file.id,
          filename: file.filename,
          size: file.size,
          metadata: file.metadata
        })),
        user: updatedUser
      });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({
        message: "❌ Server error",
        error: error.message
      });
    }
  }
);

module.exports = router;