import express from 'express';
import { bookCall, getAllCalls, callDones, addCallComment } from './controller.js';
import authenticated from '../../middleware/authenticated.js';
import validateUserType, { UserTypes } from '../../middleware/userType.js';
import roleValidation, { Roles } from "../../middleware/roleValidation.js";

const router = express.Router();

router.post('/book', authenticated, validateUserType(UserTypes.COMPLETED), bookCall);
router.get('/', authenticated, validateUserType(UserTypes.COMPLETED), roleValidation([Roles.SUPER_ADMIN]), getAllCalls);
router.put('/done', authenticated, validateUserType(UserTypes.COMPLETED), roleValidation([Roles.SUPER_ADMIN]), callDones);
router.put('/comment/:id', authenticated, validateUserType(UserTypes.COMPLETED), roleValidation([Roles.SUPER_ADMIN]), addCallComment);


export default router;
