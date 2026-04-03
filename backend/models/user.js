const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Name to display
  name: { 
    type: String, 
    required: true 
  },
  
  // Username (legacy compatibility)
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
  otpExpires: { type: Date },
  // Profile (optional)
  phone: { type: String, trim: true },
  qualification: { type: String, trim: true },
  institute: { type: String, trim: true },
  address: { type: String, trim: true },
  trainingMode: { type: String, trim: true },
  paymentAmount: { type: String, trim: true },
  paymentMode: { type: String, trim: true },
  transactionNo: { type: String, trim: true }
}, {
  timestamps: true 
});

module.exports = mongoose.model('User', UserSchema);