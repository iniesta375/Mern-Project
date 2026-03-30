const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  preferences: {
  pushNotifications: { type: Boolean, default: true },
  caregiverAlerts:   { type: Boolean, default: false },
  weeklySummary:     { type: Boolean, default: true },
},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);