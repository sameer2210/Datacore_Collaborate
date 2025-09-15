import express from 'express';
import { getAllSectors } from './controller.js';

const router = express.Router();

router.get('/', getAllSectors);

export default router;
