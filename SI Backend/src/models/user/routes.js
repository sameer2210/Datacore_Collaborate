import express from 'express';
import { register, initateRegistration, emailOtpVerification, initatePasswordReset, resetPassword, resetPasswordOtpValidation, onBoardingData, getUser, updateUserWithOrganization, inviteTeamMembers, acceptInvitation, getUsersOfOrganization, registerTeamMember, editRoleOfTeamMember, deletePendingInvitation, deleteUserAccount } from './controller.js';
import authenticated from '../../middleware/authenticated.js';
import validateUserType, { UserTypes } from '../../middleware/userType.js';
import forgotPasswordAuthenticated from "../../middleware/validateForgotPasswordToken.js";
import roleValidation, { Roles } from "../../middleware/roleValidation.js";
import {exceedMembersLimitMiddleware} from "../../middleware/quota.js";


const router = express.Router();

router.post('/initiate', initateRegistration);
router.post("/otp_validation", emailOtpVerification)
router.post("/initiate-reset-password", initatePasswordReset);
router.post("/reset-password-opt-validation", resetPasswordOtpValidation)
router.post("/reset-password", forgotPasswordAuthenticated, resetPassword)
router.post('/invite-team-members', authenticated, validateUserType(UserTypes.COMPLETED), roleValidation([Roles.ADMIN]), exceedMembersLimitMiddleware, inviteTeamMembers);
router.post("/accept-invitation/:invitedId", acceptInvitation);
router.post('/:step', authenticated, validateUserType(UserTypes.DUMMY), register);
router.get("/onboard-data", authenticated, validateUserType(UserTypes.DUMMY), onBoardingData);
router.get("/", authenticated, getUser);
router.put("/update-with-organization", authenticated, validateUserType(UserTypes.COMPLETED), updateUserWithOrganization);
router.get('/organization-users', authenticated, validateUserType(UserTypes.COMPLETED), getUsersOfOrganization);
router.post('/register-team-member/:step', authenticated, validateUserType(UserTypes.DUMMY), registerTeamMember);
router.put('/edit-role/:id', authenticated, validateUserType(UserTypes.COMPLETED), roleValidation([Roles.ADMIN]), editRoleOfTeamMember);
router.delete('/pending-invitation/:id', authenticated, validateUserType(UserTypes.COMPLETED), roleValidation([Roles.ADMIN]), deletePendingInvitation);
router.delete("/delete_user_account", authenticated, validateUserType(UserTypes.COMPLETED), deleteUserAccount);

export default router;