const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, trim: true },
  date: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Notice', NoticeSchema);
