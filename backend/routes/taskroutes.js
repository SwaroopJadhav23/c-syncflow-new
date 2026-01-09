const express = require('express');
const router = express.Router();
const Task = require('../models/task'); // Ensure your model file is named task.js

// @route   POST /api/tasks/create
// @desc    Create a new task
router.post('/create', async (req, res) => {
  try {
    // 1. LOG THE INCOMING DATA (Check your terminal!)
    console.log("--- New Request Received ---");
    console.log("Data from Frontend:", req.body);

    // 2. VALIDATION: Check if data is actually there
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ msg: "No data received by the server" });
    }

    const { title, description, assignedTo, deadline } = req.body;

    // 3. CREATE OBJECT
    const newTask = new Task({
      title,
      description,
      assignedTo,
      deadline
    });

    // 4. SAVE TO MONGODB
    const savedTask = await newTask.save(); 
    
    console.log("✅ Task Saved Successfully to DB:", savedTask);

    // 5. SEND SUCCESS RESPONSE
    res.status(201).json({ 
      msg: "Task Stored Successfully!", 
      task: savedTask 
    });

  } catch (err) {
    // 6. LOG ERRORS (This will tell you if Mongoose rejected the data)
    console.error("❌ MongoDB Save Error:", err.message);
    res.status(500).json({ 
      msg: "Error storing data", 
      error: err.message 
    });
  }
});

// @route   GET /api/tasks/all (Optional: To check if data exists)
router.get('/all', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;