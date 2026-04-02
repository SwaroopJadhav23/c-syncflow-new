const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const { protect, isAdmin } = require('../middleware/auth');

/**
 * @route   POST /api/meetings/create
 * @desc    Create a new meeting (admin only)
 * @access  Private (Admin only)
 */
router.post('/create', protect, isAdmin, meetingController.createMeeting);

/**
 * @route   GET /api/meetings/list
 * @desc    Get all meetings
 * @access  Private (All authenticated users)
 */
router.get('/list', protect, meetingController.getMeetings);

module.exports = router;
