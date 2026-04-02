const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  topic: {
    type: String,
    trim: true
  },
  meetingLink: {
    type: String,
    required: [true, 'Meeting link is required'],
    trim: true
  },
  meetingTime: {
    type: Date,
    required: [true, 'Meeting time is required']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', MeetingSchema);
