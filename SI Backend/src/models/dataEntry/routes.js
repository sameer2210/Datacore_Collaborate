import express from 'express';
const router = express.Router();
import {adminonly, protect} from '../../../dataEntryMiddle/authMiddleware.js'
import multer from 'multer';

import upload from './upload.middleware.js';

//step 1
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,

} from './company.controller.js';
import {
  createThermalEfficiency,
  getAllThermalEfficiencies,
  getThermalEfficiencyById,
  updateThermalEfficiency,
  deleteThermalEfficiency,

} from './thermalEfficiency.controller.js';

//step 2
import {
  createProductionData,
  getAllProductionData,
  getProductionDataById,
  updateProductionData,
  deleteProductionData,

} from './productionData.controller.js';

import {
  createCertification,
  getAllCertifications,
  getCertificationById,
  updateCertification,
  deleteCertification,

} from './certification.controller.js';

import {
  createUpload,
  getUploads,
  getUploadById,
  deleteUpload,
  updateUpload,

} from "./upload.controller.js";
import {
  createOperationalData,
  getAllOperationalData,
  getOperationalDataById,
  updateOperationalData,
  deleteOperationalData,

} from './operationalData.controller.js';
import {
  createElectricalData,
  getElectricalData,
  getElectricalDataById,
  updateElectricalData,
  deleteElectricalData,

} from "./electricalData.controller.js";


import {
  createHvacData,
  getAllHvacData,
  getHvacDataById,
  updateHvacData,
  deleteHvacData,

} from './hvacData.controller.js';

import {
  createScadaData,
  getAllScadaData,
  getScadaDataById,
  updateScadaData,
  deleteScadaData,

} from './scadaData.controller.js';

import {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,

} from './equipment.controller.js';


// step 1
router.post("/company",protect, createCompany);
router.get("/company",protect, getAllCompanies);
router.get("/company/:id", getCompanyById);
router.put("/company/:id", protect,updateCompany);
router.delete("/company/:id", deleteCompany);


//step 2
router.post('/production',protect, createProductionData);
router.get('/production', protect, getAllProductionData);
router.get("/production/:id", getProductionDataById);
router.put("/production/:id", protect,updateProductionData);
router.delete("/production/:id", deleteProductionData);


// Step: 5 operational Data



router.post('/operational-data',protect, createOperationalData);
router.get('/operational-data',protect, getAllOperationalData);
router.get('/operational-data/:id', getOperationalDataById);
router.put('/operational-data/:id', protect,updateOperationalData);
router.delete('/operational-data/:id', deleteOperationalData);






//electrical field

router.post(
  "/electrical-data",protect,

  upload.fields([
    { name: "diagramFile", maxCount: 1 },
    { name: "loadFile", maxCount: 1 },
  ]),
  createElectricalData
);
router.get("/electrical-data",protect, getElectricalData);
router.get("/electrical-data/:id",protect, getElectricalDataById);
router.put(
  "/electrical-data/:id",protect,
  upload.fields([
    { name: "diagramFile", maxCount: 1 },
    { name: "loadFile", maxCount: 1 }
  ]),
  updateElectricalData
);




//step 3
router.post('/certifications', protect, createCertification);
router.get('/certifications',protect, getAllCertifications);
router.get('/certifications/:id', getCertificationById);
router.put('/certifications/:id',protect, updateCertification);
router.delete('/certifications/:id', deleteCertification);



//  Create or Upload Documents (initial or duplicate-safe)



const uploadFields = upload.fields([
  { name: 'tradeLicense', maxCount: 1 },
  { name: 'plantLayout', maxCount: 1 },
  { name: 'ghgReport', maxCount: 1 },
  { name: 'wwtpLayout', maxCount: 1 },
  { name: 'manufacturingDesc', maxCount: 1 },
  { name: 'waterBalance', maxCount: 1 },
  { name: 'massBalance', maxCount: 1 },
  { name: 'energyBalance', maxCount: 1 },
  { name: 'bills', maxCount: 10 },
]);

router.post("/upload-documents", protect, (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ error: `Upload error: ${err.message}` });
    }

    console.log(" Files received:", req.files);
    next(); 
  });
}, createUpload);
router.put("/upload-documents/:id", protect, (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ error: `Upload error: ${err.message}` });
    }

    console.log(" Files received:", req.files);
    next(); 
  });
}, updateUpload);
router.get("/upload-documents", protect, getUploads);
router.get("/upload-documents/:id", protect, getUploadById);
router.delete("/upload-documents/:id", protect, deleteUpload);




// Step: HVAC Data
router.post('/hvac',protect, createHvacData);
router.get('/hvac', protect, getAllHvacData);
router.get('/hvac/:id', protect,getHvacDataById);
router.put('/hvac/:id', protect, updateHvacData);
router.delete('/hvac/:id', deleteHvacData);



// Step: Scada Data
router.post('/scada', protect, createScadaData);
router.get('/scada', protect, getAllScadaData);
router.get('/scada/:id', getScadaDataById);
router.put('/scada/:id', protect, updateScadaData);
router.delete('/scada/:id', deleteScadaData);


// step 9

router.post('/thermal-efficiency', protect, createThermalEfficiency);
router.get('/thermal-efficiency', protect, getAllThermalEfficiencies);
router.get('/thermal-efficiency/:id', getThermalEfficiencyById);
router.put('/thermal-efficiency/:id', protect, updateThermalEfficiency);
router.delete('/thermal-efficiency/:id', deleteThermalEfficiency);




router.post('/equipment',protect, createEquipment);
router.get('/equipment',protect, getAllEquipment);
router.get('/equipment/:id', getEquipmentById);
router.put('/equipment/:id', protect, updateEquipment);
router.delete('/equipment/:id', deleteEquipment);




// routes/pdfRoutes.js

import { uploadPdf, getPdf, updatePdf, deletePdfData,  } from "./reporPDFt.controller.js";

router.post("/pdf", protect, upload.fields([{ name: "file", maxCount: 1 }]), uploadPdf);
router.put("/pdf/:id", protect, upload.fields([{ name: "file", maxCount: 1 }]), updatePdf);
router.get("/pdf",protect, getPdf)

router.delete('/equipment/:id', deletePdfData);




export default router;
