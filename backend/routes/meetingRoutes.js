const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/meetings/create
 * @desc    Create a new meeting (admin only)
 * @access  Private (Admin only)
 */
router.post('/create', verifyToken, requireAdmin, meetingController.createMeeting);

/**
 * @route   GET /api/meetings/list
 * @desc    Get all meetings
 * @access  Private (All authenticated users)
 */
router.get('/list', verifyToken, meetingController.getMeetings);

module.exports = router;
