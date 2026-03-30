const AdherenceLog = require('../models/AdherenceLog.js');
const Medication = require('../models/Medication.js');

const getToday = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const logs = await AdherenceLog.find({
      userId: req.user.id,
      loggedAt: { $gte: new Date(today) }
    });
    res.json(logs.map(l => ({
      id: l._id,
      medication_id: l.medicationId,
      scheduled_time: l.scheduledTime,
      status: l.status,
      logged_at: l.loggedAt
    })));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const log = async (req, res) => {
  const { medicationId, scheduledTime, status } = req.body;
  try {
    const logEntry = new AdherenceLog({
      userId: req.user.id,
      medicationId,
      scheduledTime,
      status
    });
    await logEntry.save();
    res.json({ success: true, id: logEntry._id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getStats = async (req, res) => {
  try {
    const logs = await AdherenceLog.find({ userId: req.user.id });
    const total = logs.length;
    const taken = logs.filter(l => l.status === 'taken').length;
    const percentage = total > 0 ? Math.round((taken / total) * 100) : 0;
    res.json({ percentage, total, taken });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getToday, log, getStats };
