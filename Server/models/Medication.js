const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true,trim: true },
  dosage: { type: String, required: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'as_needed'], default: 'daily',required: true},

  times: [{type: String }],
  startDate: {type: Date, required: true },
  endDate: {type: Date },active: {type: Boolean, default: true },
  createdAt: {type: Date, default: Date.now }
});

medicationSchema.index({ userId: 1 });

module.exports = mongoose.model('Medication', medicationSchema);