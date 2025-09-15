import express from 'express';
import { getAllIndustries } from './controller.js';

const router = express.Router();

router.get('/:sector', getAllIndustries);

export default router;
