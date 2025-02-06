const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // ✅ Import cors
require('dotenv').config();

const app = express();



// ✅ Use CORS Middleware
app.use(cors({
  origin: "http://localhost:3000", // ✅ Allow frontend requests
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// Middleware
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {  // ✅ Corrected
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));



app.use('/api/auth', require('./routes/auth'));  // ✅ Handles authentication
app.use('/api/user', require('./routes/user'));  // ✅ Handles user routes
app.use('/api/admin', require('./routes/admin'));  // ✅ Handles admin routes



// Start Server
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("✅ Server is Running!");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
app.use(express.json());

