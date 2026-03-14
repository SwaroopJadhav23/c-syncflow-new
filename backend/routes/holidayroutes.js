const express = require('express');
const router = express.Router();
const Holiday = require('../models/holiday');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// GET all holidays (everyone)
router.get('/', async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });
    res.json(holidays);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin: create holiday
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, date } = req.body;
    if (!name || !name.trim() || !date) return res.status(400).json({ msg: 'Name and date are required' });
    const holiday = new Holiday({ name: name.trim(), date: new Date(date), createdBy: req.user.id });
    await holiday.save();
    res.status(201).json(holiday);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin: delete holiday
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const holiday = await Holiday.findByIdAndDelete(req.params.id);
    if (!holiday) return res.status(404).json({ msg: 'Holiday not found' });
    res.json({ msg: 'Holiday deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
