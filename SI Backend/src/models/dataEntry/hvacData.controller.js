import HvacData from './hvacData.js';

// CREATE HVAC data (one per user ideally)
export const createHvacData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user already has a record
    const existing = await HvacData.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: 'HVAC data already exists', record: existing });
    }

    const newData = await HvacData.create({ ...req.body, userId });
    res.status(201).json({ record: newData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET all HVAC data for current user (likely only one)
export const getAllHvacData = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await HvacData.find({ userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET one HVAC record by ID with user ownership check
export const getHvacDataById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const data = await HvacData.findOne({ _id: id, userId });
    if (!data) return res.status(404).json({ error: 'Not found or unauthorized' });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE HVAC data (only user's own record)
export const updateHvacData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Find record belonging to the logged-in user
    const data = await HvacData.findOne({ _id: id, userId });
    if (!data) return res.status(404).json({ error: 'Not found or unauthorized' });

    // Update data but ensure userId remains the same
    Object.assign(data, req.body);
    data.userId = userId;

    await data.save();

    res.json({ record: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE HVAC data (only user's own record)
export const deleteHvacData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await HvacData.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ error: 'Not found or unauthorized' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};








