require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- IMPORT ROUTES ---
// We use all-lowercase to match your filenames exactly
const authRoutes = require('./routes/authroutes');
const taskRoutes = require('./routes/taskroutes');
<<<<<<< HEAD
const syncRoutes = require('./routes/syncroutes'); 
=======
const adminRoutes = require('./routes/adminroutes');
const issueRoutes = require('./routes/issueroutes');
>>>>>>> 63c93ca (feat(admin): add admin panel, projects, issues, E2E scripts and cleanup; frontend admin UI and delete controls)

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
<<<<<<< HEAD
app.set('trust proxy', true);
=======

// 2. Enable JSON parsing (REQUIRED to read data from your website)
>>>>>>> 63c93ca (feat(admin): add admin panel, projects, issues, E2E scripts and cleanup; frontend admin UI and delete controls)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ---
app.get('/', (req, res) => {
  res.send("✅ SyncFlow Backend is Running!");
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
<<<<<<< HEAD
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
=======
app.use('/api/admin', adminRoutes);
app.use('/api/issues', issueRoutes);

// --- DATABASE CONNECTION ---
if (process.env.NODE_ENV !== 'test') {
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
} else {
  // In test environment we skip DB connect to keep tests lightweight
  console.log("🧪 Skipping MongoDB connect in test environment");
}

// --- START SERVER ---
// Export app for testing; only start server when not in test env
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
>>>>>>> 63c93ca (feat(admin): add admin panel, projects, issues, E2E scripts and cleanup; frontend admin UI and delete controls)
