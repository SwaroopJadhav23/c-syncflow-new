require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authroutes');
const taskRoutes = require('./routes/taskroutes');

const app = express();

// --- MIDDLEWARE ---
// 1. Enable CORS so your frontend can talk to your backend
app.use(cors());

// 2. Trust proxy to get real IP addresses
app.set('trust proxy', true);

// 3. Enable JSON parsing (REQUIRED to read data from your website)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ---
// Root Test Route
app.get('/', (req, res) => {
  res.send("✅ Backend is Running Successfully!");
});

// Use defined routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// --- DATABASE CONNECTION ---
console.log("⏳ Connecting to MongoDB...");

// Ensure MONGO_URI is defined in your .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    console.log("Connect to Database:", mongoose.connection.name);
  })
  .catch(err => {
    console.error("❌ DB Connection Error:", err.message);
  });

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});