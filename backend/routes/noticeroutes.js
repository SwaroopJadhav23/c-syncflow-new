const express = require('express');
const router = express.Router();
const Notice = require('../models/notice');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// GET all notices (any authenticated user or public - you can add verifyToken if needed)
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin: create notice
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { title, content, date } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ msg: 'Title is required' });
    const notice = new Notice({ title: title.trim(), content, date: date ? new Date(date) : new Date(), createdBy: req.user.id });
    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin: update notice
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notice) return res.status(404).json({ msg: 'Notice not found' });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin: delete notice
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ msg: 'Notice not found' });
    res.json({ msg: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
