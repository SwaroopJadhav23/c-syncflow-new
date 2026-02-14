const express = require('express');
const router = express.Router();
const Issue = require('../models/issue');
const { verifyToken } = require('../middleware/authMiddleware');

// Report an issue (authenticated user)
router.post('/report', verifyToken, async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (!title || title.trim() === '') return res.status(400).json({ msg: 'Title is required' });
    if (priority && !['low', 'medium', 'high'].includes(priority)) return res.status(400).json({ msg: 'Invalid priority' });
    const issue = new Issue({ title: title.trim(), description, priority: priority || 'medium', reportedBy: req.user.id });
    await issue.save();
    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get issues reported by this user
router.get('/my', verifyToken, async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user.id });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;


