import express from 'express';
import { getAllEmployeeCounts } from './controller.js';

const router = express.Router();

router.get('/', getAllEmployeeCounts);

export default router;
