const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const Notice = require('../models/notice');
const Holiday = require('../models/holiday');
const LeaveRequest = require('../models/leaveRequest');
const { verifyToken } = require('../middleware/authMiddleware');

// GET dashboard summary for current user
router.get('/summary', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [activeTasks, nextTask, notices, nextHoliday, pendingLeaves] = await Promise.all([
      Task.countDocuments({ assignedTo: userId, status: { $ne: 'Completed' } }),
      Task.findOne({ assignedTo: userId, status: { $ne: 'Completed' }, deadline: { $gte: new Date() } }).sort({ deadline: 1 }).select('title deadline'),
      Notice.countDocuments(),
      Holiday.findOne({ date: { $gte: new Date() } }).sort({ date: 1 }).select('name date'),
      LeaveRequest.countDocuments({ user: userId, status: 'pending' })
    ]);
    res.json({
      activeTasks,
      pendingDeadline: nextTask ? new Date(nextTask.deadline).toLocaleDateString() : '—',
      nextTaskTitle: nextTask ? nextTask.title : null,
      nextMeeting: '—', // optional: wire to sync meetings if needed
      nextHoliday: nextHoliday ? `${nextHoliday.date.toLocaleDateString()} - ${nextHoliday.name}` : '—',
      unreadNotices: notices,
      pendingLeaves
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
