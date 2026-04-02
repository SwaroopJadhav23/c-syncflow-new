const Meeting = require('../models/meeting');
const Notification = require('../models/notification');
const User = require('../models/user');

exports.createMeeting = async (req, res) => {
  try {
    const { topic, meetingLink, meetingTime } = req.body;

    // Validate required fields
    if (!meetingLink || !meetingTime) {
      return res.status(400).json({ 
        msg: 'Meeting link and meeting time are required' 
      });
    }

    // Create meeting
    const meeting = await Meeting.create({
      topic,
      meetingLink,
      meetingTime: new Date(meetingTime),
      createdBy: req.user.id
    });

    // Fetch all employee users
    const employees = await User.find({ role: 'employee' }).select('_id');
    
    if (employees.length > 0) {
      // Create notification for all employees
      const notification = await Notification.create({
        title: 'New Meeting Scheduled',
        message: `${topic || 'Meeting'} scheduled for ${new Date(meetingTime).toLocaleString()}`,
        type: 'meeting',
        users: employees.map(emp => emp._id)
      });

      // Emit real-time notification to each user room
      const io = req.app.get('io');
      if (io) {
        employees.forEach(employee => {
          io.to(employee._id.toString()).emit('new_notification', {
            title: notification.title,
            message: notification.message,
            type: notification.type,
            createdAt: notification.createdAt
          });
        });
      }
    }

    // Populate meeting with creator details
    await meeting.populate('createdBy', 'name email');

    res.status(201).json({
      msg: 'Meeting created successfully',
      meeting
    });

  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({ 
      msg: 'Server error while creating meeting' 
    });
  }
};

exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate('createdBy', 'name email')
      .sort({ meetingTime: 1 });

    res.json(meetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ 
      msg: 'Server error while fetching meetings' 
    });
  }
};
