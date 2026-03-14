const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/authMiddleware');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    // 1. Get Data (FIXED: changed 'employeeid' to 'employeeId')
    const { username, employeeId, email, password, role } = req.body;

    // 2. Validate Inputs
    if (!username || !employeeId || !email || !password) {
      return res.status(400).json({ msg: "Please fill in all fields." });
    }

    // 3. Check if user exists (Email OR EmployeeID)
    const existingUser = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (existingUser) {
      return res.status(400).json({ msg: "User with this Email or Employee ID already exists." });
    }

    // 4. Hash the Password (Security)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create new user
    const newUser = new User({ 
      username, 
      employeeId, // Matches Schema now
      email, 
      password: hashedPassword, 
      role 
    });

    await newUser.save();
    res.status(201).json({ msg: "Registration successful! Please login." });

  } catch (err) {
    console.error("Register Error:", err); // Prints error to terminal so you can see it
    res.status(500).json({ msg: "Server Error: " + err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // 2. Check password (Compare Hashed vs Plain)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 3. Create Real Token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || "fallback_secret", 
      { expiresIn: "1d" }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email,
        role: user.role
      } 
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// GET current user profile (authenticated)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// PUT update profile (authenticated)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const allowed = ['username', 'email', 'phone', 'qualification', 'institute', 'address', 'trainingMode', 'paymentAmount', 'paymentMode', 'transactionNo'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password -otp');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Forgot password: send OTP (store in user, log to console for dev)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: 'Email is required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();
    console.log('OTP for', email, ':', otp);
    res.json({ msg: 'OTP sent. Check server console in development.' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ msg: 'Email and OTP required' });
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }
    res.json({ msg: 'OTP verified' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Reset password (after OTP verified)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ msg: 'Email, OTP and new password required' });
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;