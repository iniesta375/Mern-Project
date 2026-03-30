const mongoose = require('mongoose');

const wellnessLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String, required: true },
  note: String,
  loggedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WellnessLog', wellnessLogSchema);