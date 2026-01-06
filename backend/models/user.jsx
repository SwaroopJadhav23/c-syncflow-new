const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Using Email as ID
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'employee', 'intern'], 
    default: 'employee' 
  },
  otp: { type: String },
  otpExpires: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);