const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- MIDDLEWARE ---
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app-name.vercel.app', 'https://your-app-name.onrender.com']
    : ['http://localhost:3000'],
  credentials: true
}));
app.set('trust proxy', true);

// Enable JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- HEALTH CHECK ROUTE ---
app.get('/', (req, res) => {
  res.json({ 
    status: '✅ SyncFlow Backend is Running!',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// --- DATABASE CONNECTION ---
if (process.env.NODE_ENV !== 'test') {
  if (!process.env.MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is not defined");
    process.exit(1);
  }

  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("✅ MongoDB Connected Successfully");
      console.log("Database:", mongoose.connection.name);
    })
    .catch(err => {
      console.error("❌ DB Connection Error:", err.message);
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
