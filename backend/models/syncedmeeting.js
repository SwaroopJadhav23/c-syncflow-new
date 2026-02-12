const mongoose = require('mongoose');

const SyncedMeetingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  sender: {
    type: String
  },
  receivedDate: {
    type: Date,
    required: true
  },
  messageId: {
    type: String,
    unique: true, 
    required: true
  },
  platform: {
    type: String,
    default: 'IMAP'
  },
  meetingLink: {
    type: String 
  }
}, { timestamps: true });

module.exports = mongoose.model('SyncedMeeting', SyncedMeetingSchema);