const Medication = require('../models/Medication.js');

const list = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const medications = await Medication.find({ userId: req.user.id, active: true });
    
    res.json(medications.map(m => ({
      id: m._id,
      name: m.name,
      dosage: m.dosage,
      frequency: m.frequency,
      times: m.times,
      start_date: m.startDate,
      end_date: m.endDate
    })));
  } catch (error) {
    console.error("LIST ERROR:", error);
    res.status(500).json({ error: 'Server error fetching medications' });
  }
};

const create = async (req, res) => {
  const { name, dosage, frequency, times, startDate, endDate } = req.body;
  
  try {
    const parsedStartDate = new Date(startDate);
    if (isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({ error: 'Invalid Start Date provided' });
    }

    const medication = new Medication({
      userId: req.user.id,
      name,
      dosage,
      frequency,
      times,
      startDate: parsedStartDate,
      endDate: endDate ? new Date(endDate) : null,
      active: true 
    });

    await medication.save();
    
    res.json({ 
      id: medication._id, 
      name: medication.name, 
      dosage: medication.dosage, 
      frequency: medication.frequency, 
      times: medication.times, 
      start_date: medication.startDate, 
      end_date: medication.endDate 
    });
  } catch (error) {
    console.error("CREATE ERROR:", error); 
    res.status(500).json({ error: 'Server error saving medication' });
  }
};

const remove = async (req, res) => {
  try {
    const result = await Medication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, 
      { active: false },
      { new: true } 
    );

    if (!result) return res.status(404).json({ error: 'Medication not found' });
    
    res.json({ success: true });
  } catch (error) {
    console.error("REMOVE ERROR:", error);
    res.status(500).json({ error: 'Server error deleting medication' });
  }
};

module.exports = { list, create, remove };