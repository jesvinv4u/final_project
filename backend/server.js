const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require("fs");
const uploadRoutes = require("./routes/upload"); // ✅ Import upload route

require('dotenv').config();

const app = express();

// ✅ Use CORS Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Middleware
app.use(express.json()); // ✅ Use Express built-in JSON parser (instead of bodyParser)
app.use(express.urlencoded({ extended: true }));

// ✅ Ensure `uploads/` Directory Exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ✅ Serve Uploaded Files Statistically
app.use("/uploads", express.static(uploadDir));

// ✅ API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));
app.use('/upload', uploadRoutes);  // ✅ Handles file uploads

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
