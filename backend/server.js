require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- IMPORT ROUTES ---
// We use all-lowercase to match your filenames exactly
const authRoutes = require('./routes/authroutes');
const taskRoutes = require('./routes/taskroutes');
const syncRoutes = require('./routes/syncroutes'); 

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ---
app.get('/', (req, res) => {
  res.send("✅ SyncFlow Backend is Running!");
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/sync', syncRoutes); 

// --- DATABASE CONNECTION ---
// Check if MONGO_URI exists to prevent immediate crash
if (!process.env.MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is not defined in your .env file.");
    process.exit(1);
}

console.log("⏳ Connecting to MongoDB...");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch(err => {
    console.error("❌ DB Connection Error:", err.message);
  });

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Routes active: /api/auth, /api/tasks, /api/sync`);
});