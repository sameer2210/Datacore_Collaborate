import ScadaData from './scadaData.js';

// CREATE SCADA data (one per user ideally)
export const createScadaData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user already has a record
    const existing = await ScadaData.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: 'SCADA data already exists', record: existing });
    }

    const newData = await ScadaData.create({ ...req.body, userId });
    res.status(201).json({ record: newData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET all SCADA data for current user (likely only one)
export const getAllScadaData = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await ScadaData.find({ userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET one SCADA record by ID with user ownership check
export const getScadaDataById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const data = await ScadaData.findOne({ _id: id, userId });
    if (!data) return res.status(404).json({ error: 'Not found or unauthorized' });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE SCADA data (only user's own record)
export const updateScadaData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const data = await ScadaData.findOne({ _id: id, userId });
    if (!data) return res.status(404).json({ error: 'Not found or unauthorized' });

    Object.assign(data, req.body);
    data.userId = userId;

    await data.save();

    res.json({ record: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE SCADA data (only user's own record)
export const deleteScadaData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await ScadaData.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ error: 'Not found or unauthorized' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



