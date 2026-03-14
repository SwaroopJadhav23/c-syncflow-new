const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/leaveRequest');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// User: submit leave request
router.post('/', verifyToken, async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    if (!type || !startDate || !endDate) return res.status(400).json({ msg: 'Type, startDate and endDate are required' });
    const leave = new LeaveRequest({ user: req.user.id, type, startDate: new Date(startDate), endDate: new Date(endDate), reason });
    await leave.save();
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// User: get my leave requests
router.get('/my', verifyToken, async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin: get all leave requests
router.get('/all', verifyToken, requireAdmin, async (req, res) => {
  try {
    const leaves = await LeaveRequest.find().populate('user', 'username email').sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin: update leave status
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) return res.status(400).json({ msg: 'Invalid status' });
    const leave = await LeaveRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!leave) return res.status(404).json({ msg: 'Leave request not found' });
    res.json(leave);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
