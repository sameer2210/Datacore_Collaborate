import express from 'express';
import {
    create,
    update,
    get,
    getAll,
    remove,
    activateSubscriptionPlanController,
    getUserQuota,
    totalRevenueController,
    getMonthlyRevenueController
} from './controller.js';
import authenticated from '../../middleware/authenticated.js';
import roleValidation, { Roles } from "../../middleware/roleValidation.js";

const router = express.Router();

// Create a new subscription plan
router.post(
    '/',
    authenticated,
    roleValidation([Roles.SUPER_ADMIN]),
    create
);

// Update a subscription plan
router.put(
    '/:planId',
    authenticated,
    roleValidation([Roles.SUPER_ADMIN]),
    update
);
router.get(
    '/active-plan',
    authenticated,
    roleValidation([Roles.ADMIN]),
    getUserQuota
);

router.get(
    '/total-revenue',
    authenticated,
    roleValidation([Roles.SUPER_ADMIN]),
    totalRevenueController
);

router.get(
    '/monthly-revenue',
    authenticated,
    roleValidation([Roles.SUPER_ADMIN]),
    getMonthlyRevenueController
);

// Get a specific subscription plan
router.get(
    '/:planId',
    authenticated,
    get
);

// Get all subscription plans
router.get(
    '/',
    authenticated,
    getAll
);

// Delete a subscription plan
router.delete(
    '/:planId',
    authenticated,
    roleValidation([Roles.SUPER_ADMIN]),
    remove
);

router.post(
    '/activate/:planId',
    authenticated,
    roleValidation([Roles.ADMIN]),
    activateSubscriptionPlanController
);


export default router;
