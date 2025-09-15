import express from 'express';
const router = express.Router();
import authenticated from '../../middleware/authenticated.js';
import validateUserType, { UserTypes } from '../../middleware/userType.js';
import { getUnits } from './controller.js';

router.get('/', getUnits);

export default router;