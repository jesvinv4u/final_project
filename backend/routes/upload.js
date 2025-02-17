import express from 'express';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import mongoose from 'mongoose';
import authMiddleware from '../middleware/authMiddleware.js';


const router = express.Router();

// Configure GridFS Storage
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: 'uploads',
      metadata: {
        userId: req.user?.id,
        originalName: file.originalname,
        contentType: file.mimetype
      }
    };
  }
});

// Configure Multer
const upload = multer({ storage });

// Upload Route
router.post('/', authMiddleware, upload.array('documents', 5), async (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ message: "❌ No files uploaded" });
    }

    const fileInfo = req.files.map(file => ({
      id: file.id,
      filename: file.filename,
      contentType: file.contentType,
      size: file.size,
      uploadDate: file.uploadDate
    }));

    res.json({
      message: "✅ Files uploaded successfully",
      files: fileInfo
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      message: "❌ Error uploading files",
      error: error.message 
    });
  }
});

// Get File List Route
router.get('/', authMiddleware, async (req, res) => {
  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });
    
    const files = await bucket.find({ 'metadata.userId': req.user.id }).toArray();
    
    if (!files?.length) {
      return res.status(404).json({ message: "❌ No files found" });
    }

    res.json(files);
  } catch (error) {
    console.error("File list error:", error);
    res.status(500).json({ 
      message: "❌ Error fetching files",
      error: error.message 
    });
  }
});

export default router;