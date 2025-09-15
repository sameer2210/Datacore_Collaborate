import Certification from './certificationSchema.js';

//  CREATE Certification (Only one per user)
export const createCertification = async (req, res) => {
  try {
    const userId = req.user.id;

    const existing = await Certification.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: 'Certification data already exists', record: existing });
    }

    const newCert = await Certification.create({ ...req.body,  userId });
    res.status(201).json({ record: newCert });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//  GET ALL Certifications for current user
export const getAllCertifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await Certification.find({  userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  GET One by ID (with user check)
export const getCertificationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const cert = await Certification.findOne({ _id: id,  userId });
    if (!cert) return res.status(404).json({ error: "Not found or unauthorized" });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  UPDATE (only user's own record)
export const updateCertification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const cert = await Certification.findOne({ _id: id,  userId });
    if (!cert) return res.status(404).json({ error: "Not found or unauthorized" });

    Object.assign(cert, req.body);
    await cert.save();

    res.json({ record: cert });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE (if belongs to user)
export const deleteCertification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await Certification.findOneAndDelete({ _id: id,  userId });
    if (!deleted) return res.status(404).json({ error: 'Not found or unauthorized' });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



