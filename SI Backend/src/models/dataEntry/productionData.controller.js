// src/models/productionData/productionData.controller.js
import ProductionData from './productionData.js';

//  Create Production Data (or prevent duplicates for the same user)
export const createProductionData = async (req, res) => {
  try {
    const userId = req.user.id;

    const existing = await ProductionData.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: 'Production data already exists', production: existing });
    }

    const data = await ProductionData.create({ ...req.body,  userId });
    res.status(201).json({ production: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Get all Production Data for logged-in user
export const getAllProductionData = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await ProductionData.find({  userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Get Production Data by ID (only if it belongs to user)
export const getProductionDataById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const data = await ProductionData.findOne({ _id: id,  userId });
    if (!data) return res.status(404).json({ error: 'Production data not found or unauthorized' });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Update Production Data (only if it belongs to user)
export const updateProductionData = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("userid",userId);
    
    const { id } = req.params;

    const data = await ProductionData.findOne({ _id: id,  userId });
    if (!data) return res.status(404).json({ error: 'Production data not found or unauthorized' });

    Object.assign(data, req.body);
    await data.save();

    res.json({ production: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//  Delete Production Data (only if it belongs to user)
export const deleteProductionData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await ProductionData.findOneAndDelete({  userId });
    if (!deleted) return res.status(404).json({ error: 'Production data not found or unauthorized' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};






