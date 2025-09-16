import express from 'express';
const router = express.Router();

import { adminonly, protect } from '../../dataEntryMiddle/authMiddleware.js';
import User from '../models/cra/user.js';
import Certification from '../models/dataEntry/certificationSchema.js';
import Company from '../models/dataEntry/companySchema.js';
import electricalData from '../models/dataEntry/electricalData.js';
import Equipment from '../models/dataEntry/equipment.js';
import HvacData from '../models/dataEntry/hvacData.js';
import OperationalData from '../models/dataEntry/operationalData.js';
import ProductionData from '../models/dataEntry/productionData.js';
import Pdf from '../models/dataEntry/reportPDF.js';
import ScadaData from '../models/dataEntry/scadaData.js';
import ThermalEfficiency from '../models/dataEntry/thermalEfficiency.js';
import Upload from '../models/dataEntry/upload.js';

router.get('/company', protect, adminonly(), async (req, res) => {
  try {
    console.log(req.user.id);

    console.log(req.user.id);
    const items = await Company.find();
    console.log(items);
    // find() fetches all documents
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

router.get('/production', protect, adminonly(), async (req, res) => {
  try {
    const items = await ProductionData.find(); // find() fetches all documents
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});
router.get('/operational-data', protect, adminonly(), async (req, res) => {
  try {
    const items = await OperationalData.find(); // find() fetches all documents
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

router.get('/electrical-data', protect, adminonly(), async (req, res) => {
  try {
    const items = await electricalData.find(); // find() fetches all documents
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});
router.get('/certifications', protect, adminonly(), async (req, res) => {
  try {
    const items = await Certification.find(); // find() fetches all documents
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});
router.get('/upload-documents', protect, adminonly(), async (req, res) => {
  try {
    const items = await Upload.find(); // find() fetches all documents
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

router.get('/hvac', protect, adminonly(), async (req, res) => {
  try {
    const items = await HvacData.find(); // find() fetches all documents
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});
router.get('/scada', protect, adminonly(), async (req, res) => {
  try {
    const items = await ScadaData.find(); // find() fetches all documents
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});
router.get('/thermal-efficiency', protect, adminonly(), async (req, res) => {
  try {
    const items = await ThermalEfficiency.find(); // find() fetches all documents
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});
router.get('/equipment', protect, adminonly(), async (req, res) => {
  try {
    const items = await Equipment.find(); // find() fetches all documents
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});
router.get('/pdf', protect, adminonly(), async (req, res) => {
  try {
    const items = await Pdf.find(); // find() fetches all documents
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

router.get('/all-user', protect, adminonly(), async (req, res) => {
  try {
    const items = await User.find();
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

router.delete('/user/:id', protect, adminonly(), async (req, res) => {
  try {
    const userId = req.params.id;

    // Parallel delete for performance 🚀
    await Promise.all([
      User.findByIdAndDelete(userId),
      Company.deleteMany({ userId }),
      ProductionData.deleteMany({ userId }),
      OperationalData.deleteMany({ userId }),
      electricalData.deleteMany({ userId }),
      Certification.deleteMany({ userId }),
      Upload.deleteMany({ userId }),
      HvacData.deleteMany({ userId }),
      ScadaData.deleteMany({ userId }),
      ThermalEfficiency.deleteMany({ userId }),
      Equipment.deleteMany({ userId }),
      Pdf.deleteMany({ userId }),
    ]);

    res.status(200).json({
      success: true,
      message: 'User and all related data deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user and related data:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error while deleting user',
      error: error.message,
    });
  }
});

export default router;
