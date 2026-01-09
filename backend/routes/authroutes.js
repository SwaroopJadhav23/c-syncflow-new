const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Fixed: Capital 'U' to match file name
const bcrypt = require('bcryptjs'); // Make sure to: npm install bcryptjs
const jwt = require('jsonwebtoken'); // Make sure to: npm install jsonwebtoken

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

module.exports = router;