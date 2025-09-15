import ThermalEfficiency from './thermalEfficiency.js';

// CREATE Thermal Efficiency data (one per user ideally)
export const createThermalEfficiency = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user already has a record
    const existing = await ThermalEfficiency.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: 'Thermal Efficiency data already exists', record: existing });
    }

    const newData = await ThermalEfficiency.create({ ...req.body, userId });
    res.status(201).json({ record: newData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET all Thermal Efficiency data for current user (likely only one)
export const getAllThermalEfficiencies = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await ThermalEfficiency.find({ userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET one Thermal Efficiency record by ID with user ownership check
export const getThermalEfficiencyById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const data = await ThermalEfficiency.findOne({ _id: id, userId });
    if (!data) return res.status(404).json({ error: 'Not found or unauthorized' });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE Thermal Efficiency data (only user's own record)
export const updateThermalEfficiency = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const data = await ThermalEfficiency.findOne({ _id: id, userId });
    if (!data) return res.status(404).json({ error: 'Not found or unauthorized' });

    Object.assign(data, req.body);
    data.userId = userId;

    await data.save();

    res.json({ record: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE Thermal Efficiency data (only user's own record)
export const deleteThermalEfficiency = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await ThermalEfficiency.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ error: 'Not found or unauthorized' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





