import OperationalData from './operationalData.js';

// CREATE OperationalData (Only one per user)
export const createOperationalData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user already has a record
    const existing = await OperationalData.findOne({  userId });
    if (existing) {
      return res.status(400).json({ message: 'Operational data already exists', record: existing });
    }

    const newData = await OperationalData.create({ ...req.body,  userId });
    res.status(201).json({ record: newData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL OperationalData for current user (typically only one)
export const getAllOperationalData = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await OperationalData.find({  userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET One by ID with user check
export const getOperationalDataById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const data = await OperationalData.findOne({ _id: id,  userId });
    if (!data) return res.status(404).json({ error: "Not found or unauthorized" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE operationalData (only user's own record)
export const updateOperationalData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Find record belonging to the logged-in user
    const data = await OperationalData.findOne({ _id: id, user_id: userId });
    if (!data) return res.status(404).json({ error: "Not found or unauthorized" });

    // Update data but ensure user_id remains the same
    Object.assign(data, req.body);
    data.userId = userId; // Ensure user_id stays consistent

    await data.save();

    res.json({ record: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// DELETE (only if belongs to user)
export const deleteOperationalData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await OperationalData.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ error: 'Not found or unauthorized' });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





