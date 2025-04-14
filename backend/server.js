import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';
import roomRequestRoutes from "./routes/roomRequestRoutes.js";
import bookRoomRoutes from "./routes/bookroom.js";
import vacateRoomRoutes from "./routes/vacateRoom.js";
import adminVacateRoutes from "./routes/adminvacate.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// ✅ Use CORS Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5001'],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/your_database_name';
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

// ✅ Initialize MongoDB connection with GridFS
let gfs;
try {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  console.log('✅ MongoDB Connected');
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
} catch (err) {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
}

// Add connection error handler
mongoose.connection.on('error', err => {
  console.error('❌ MongoDB Connection Error:', err);
});

// Add disconnection handler
mongoose.connection.on('disconnected', () => {
  console.log('❌ MongoDB Disconnected');
});

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use("/api/room-requests", roomRequestRoutes);
app.use('/api/room/book', bookRoomRoutes);
app.use("/api/room/vacate", vacateRoomRoutes);
app.use("/api/admin/vacate", adminVacateRoutes);


// ✅ Root Route
app.get("/", (req, res) => {
  res.send("✅ Server is Running!");
});

// ✅ Global Error Handler (Prevents Server Crashes)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ message: "❌ Internal Server Error", error: err.message });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
