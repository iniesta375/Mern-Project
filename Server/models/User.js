const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
    default: '',
    trim: true,
  },
  googleId: {
    type: String,
    default: null,
  },
  avatarUrl: {
    type: String,
    default: '',
  },
  preferences: {
    pushNotifications: { type: Boolean, default: true  },
    caregiverAlerts:   { type: Boolean, default: false },
    weeklySummary:     { type: Boolean, default: true  },
  },

  resetPasswordToken:   { type: String,  default: null },
  resetPasswordExpires: { type: Date,    default: null },

}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);