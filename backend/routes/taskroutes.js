const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const { verifyToken } = require('../middleware/authMiddleware');

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

    const { title, description, assignedTo, deadline, priority, timeRequired, projectId } = req.body;
    const newTask = new Task({
      title,
      description,
      assignedTo: assignedTo || 'Unassigned',
      deadline,
      priority: priority && ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
      timeRequired,
      projectId
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

// @route   GET /api/tasks/all
router.get('/all', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/tasks/my — tasks for current user (assignedTo = userId)
router.get('/my', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/tasks/my — create task for current user (timesheet)
router.post('/my', verifyToken, async (req, res) => {
  try {
    const { title, description, deadline, timeRequired, projectName, allottedBy } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ msg: 'Title is required' });
    const newTask = new Task({
      title: title.trim(),
      description,
      assignedTo: req.user.id,
      deadline: deadline ? new Date(deadline) : undefined,
      timeRequired,
      projectName,
      allottedBy,
      priority: 'medium'
    });
    const saved = await newTask.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   DELETE /api/tasks/:id — delete own task (assignedTo must be current user)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, assignedTo: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found or not yours' });
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;