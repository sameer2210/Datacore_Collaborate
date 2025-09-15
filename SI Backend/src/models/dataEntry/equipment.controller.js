import Equipment from './equipment.js';

// CREATE Equipment data (one per user ideally)
export const createEquipment = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user already has a record
    const existing = await Equipment.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: 'Equipment data already exists', record: existing });
    }

    const newData = await Equipment.create({ ...req.body, userId });
    res.status(201).json({ record: newData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET all Equipment data for current user (likely only one)
export const getAllEquipment = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await Equipment.find({ userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET one Equipment record by ID with user ownership check
export const getEquipmentById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const data = await Equipment.findOne({ _id: id, userId });
    if (!data) return res.status(404).json({ error: 'Not found or unauthorized' });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE Equipment data (only user's own record)
export const updateEquipment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const data = await Equipment.findOne({ _id: id, userId });
    if (!data) return res.status(404).json({ error: 'Not found or unauthorized' });

    Object.assign(data, req.body);
    data.userId = userId;

    await data.save();

    res.json({ record: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE Equipment data (only user's own record)
export const deleteEquipment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await Equipment.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ error: 'Not found or unauthorized' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};






