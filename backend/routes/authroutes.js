const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Fixed: Capital 'U' to match file name
const LoginHistory = require('../models/loginHistory'); // Import LoginHistory model
const bcrypt = require('bcryptjs'); // Make sure to: npm install bcryptjs
const jwt = require('jsonwebtoken'); // Make sure to: npm install jsonwebtoken

// REGISTER
router.post('/register', async (req, res) => {
  try {
    // 1. Get Data (FIXED: changed 'employeeid' to 'employeeId')
    const { username, employeeId, email, password, role } = req.body;

    console.log("--- Registration Attempt ---");
    console.log("Data received:", { username, employeeId, email, role: role || 'employee' });

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
      role: role || 'employee'
    });

    const savedUser = await newUser.save();
    console.log("✅ User registered successfully:", savedUser._id);
    
    res.status(201).json({ 
      msg: "Registration successful! Please login.",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        employeeId: savedUser.employeeId
      }
    });

  } catch (err) {
    console.error("Register Error:", err); // Prints error to terminal so you can see it
    res.status(500).json({ msg: "Server Error: " + err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Get IP address and user agent for logging
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Log incoming login attempt
    console.log("--- Login Attempt ---");
    console.log("Email:", email);
    console.log("IP Address:", ipAddress);
    
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Log failed login attempt
      try {
        await LoginHistory.create({
          email: email,
          username: 'unknown',
          userId: null,
          ipAddress: ipAddress,
          userAgent: userAgent,
          status: 'failed',
          failureReason: 'User not found'
        });
      } catch (logErr) {
        console.error("Error saving login history:", logErr);
      }
      return res.status(400).json({ msg: "User not found" });
    }

    // 2. Check password (Compare Hashed vs Plain)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Log failed login attempt
      try {
        await LoginHistory.create({
          userId: user._id,
          email: user.email,
          username: user.username,
          ipAddress: ipAddress,
          userAgent: userAgent,
          status: 'failed',
          failureReason: 'Invalid password'
        });
      } catch (logErr) {
        console.error("Error saving login history:", logErr);
      }
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 3. Create Real Token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || "fallback_secret", 
      { expiresIn: "1d" }
    );
    
    // 4. Save successful login to database
    try {
      const loginHistory = await LoginHistory.create({
        userId: user._id,
        email: user.email,
        username: user.username,
        ipAddress: ipAddress,
        userAgent: userAgent,
        status: 'success'
      });
      console.log("✅ Login history saved successfully:", loginHistory._id);
    } catch (logErr) {
      console.error("Error saving login history:", logErr);
      // Don't fail the login if history saving fails, just log it
    }
    
    console.log("✅ Login successful for user:", user.email);
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email,
        role: user.role,
        employeeId: user.employeeId
      } 
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server Error: " + err.message });
  }
});

// GET LOGIN HISTORY (Optional: For admin to view login history)
router.get('/login-history', async (req, res) => {
  try {
    const { userId, limit = 50 } = req.query;
    
    let query = {};
    if (userId) {
      query.userId = userId;
    }
    
    const history = await LoginHistory.find(query)
      .sort({ loginTime: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'username email employeeId');
    
    res.json({ history, count: history.length });
  } catch (err) {
    console.error("Error fetching login history:", err);
    res.status(500).json({ msg: "Server Error: " + err.message });
  }
});

module.exports = router;