import express from 'express';
import { getAllAnnualRevenues } from './controller.js';

const router = express.Router();

router.get('/', getAllAnnualRevenues);

export default router;
