const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Name to display
  username: { 
    type: String, 
    required: true 
  }, 

  // ID Badge (Must match "employeeId" exactly in routes)
  employeeId: { 
    type: String, 
    required: true, 
    unique: true 
  },

  // Login Email
  email: { 
    type: String, 
    required: true, 
    unique: true 
  }, 

  // Hashed Password
  password: { 
    type: String, 
    required: true 
  },

  // Role
  role: { 
    type: String, 
    enum: ['admin', 'manager', 'employee', 'intern'], 
    default: 'employee' 
  },

  otp: { type: String },
  otpExpires: { type: Date }
}, {
  timestamps: true 
});

module.exports = mongoose.model('User', UserSchema);