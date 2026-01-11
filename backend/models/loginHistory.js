const mongoose = require('mongoose');

const LoginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow null for failed logins where user doesn't exist
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  loginTime: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success'
  },
  failureReason: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LoginHistory', LoginHistorySchema);

