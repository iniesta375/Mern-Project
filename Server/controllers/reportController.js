const AdherenceLog = require('../models/AdherenceLog.js');
const WellnessLog = require('../models/WellnessLog.js');

const getSummary = async (req, res) => {
  try {
    const [adherenceLogs, wellnessLogs] = await Promise.all([
      AdherenceLog.find({ userId: req.user.id }),
      WellnessLog.find({ userId: req.user.id })
    ]);
    res.json({
      adherence: adherenceLogs.map(l => ({
        id: l._id,
        medication_id: l.medicationId,
        scheduled_time: l.scheduledTime,
        status: l.status,
        logged_at: l.loggedAt
      })),
      wellness: wellnessLogs.map(l => ({
        id: l._id,
        mood: l.mood,
        note: l.note,
        logged_at: l.loggedAt
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getSummary };
