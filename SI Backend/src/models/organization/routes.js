import express from 'express';
import {
    getOrganization,
    updateStatus,
    getAllOrganizations,
    getOrganizationForAdmin,
    getOrganizationCount // Add this import
} from './controller.js';
import authenticated from '../../middleware/authenticated.js';
import validateUserType, { UserTypes } from '../../middleware/userType.js';
import roleValidation, { Roles } from "../../middleware/roleValidation.js";

const router = express.Router();

router.get('/', authenticated, validateUserType(UserTypes.COMPLETED), getOrganization);
router.get('/all', authenticated, validateUserType(UserTypes.COMPLETED), roleValidation([Roles.SUPER_ADMIN]), getAllOrganizations)
router.put('/update-status', authenticated, validateUserType(UserTypes.COMPLETED), roleValidation([Roles.SUPER_ADMIN]), updateStatus);
router.get('/count', authenticated, roleValidation([Roles.SUPER_ADMIN]), getOrganizationCount);
router.get('/:id', authenticated, validateUserType(UserTypes.COMPLETED), roleValidation([Roles.SUPER_ADMIN]), getOrganizationForAdmin)

export default router;