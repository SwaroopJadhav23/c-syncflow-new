const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); 
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const server = http.createServer(app); 

app.use(cors());
app.use(express.json());

// --- DATABASE MODEL ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  customId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'employee' }
});
const User = mongoose.model('User', userSchema);

// --- ROUTES ---

// 1. TEST ROUTE (Type this in browser: localhost:5000/api/auth/register)
// This is just to prove the server "sees" the path.
app.get('/api/auth/register', (req, res) => {
  res.send("✅ The server recognizes this URL! Now try registering from the React app.");
});

// 2. ACTUAL REGISTRATION ROUTE (Used by React)
app.post('/api/auth/register', async (req, res) => {
  console.log("Registration request received:", req.body);
  try {
    const { name, customId, email, password, role } = req.body;
    const userExists = await User.findOne({ $or: [{ email }, { customId }] });
    if (userExists) return res.status(400).json({ msg: "User already exists." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, customId, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ msg: "Registration Successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

app.get('/', (req, res) => res.send("Backend is Running!"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

const PORT = 5000; // Hardcoded to 5000 for now to be sure
server.listen(PORT, () => console.log(`🚀 SERVER LISTENING ON PORT ${PORT}`));