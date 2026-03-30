const WellnessLog = require('../models/WellnessLog.js');

const list = async (req, res) => {
  try {
    const logs = await WellnessLog.find({ userId: req.user.id }).sort({ loggedAt: -1 });
    res.json(logs.map(l => ({
      id: l._id,
      mood: l.mood,
      note: l.note,
      logged_at: l.loggedAt
    })));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const log = async (req, res) => {
  const { mood, note } = req.body;
  try {
    const logEntry = new WellnessLog({
      userId: req.user.id,
      mood,
      note
    });
    await logEntry.save();
    res.json({ success: true, id: logEntry._id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { list, log };
