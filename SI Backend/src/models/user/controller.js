import multer from 'multer';
import { validateAndSanitizeRegistrationData, validateAndSanitizeInitateRegistration, validateAndSanitizeOTPValidation, validateAndSanitizeInitateResetPassword, validateAndSanitizeResetPassword, validateAndSanitizeUserAndOrganizationUpdate, validateAndSanitizeTeamMembers, validateAndSanitizeTeamMemberStep1, validateAndSanitizeTeamMemberStep2 } from './dto.js';
import { uploadFileToS3 } from "../../util/awsS3.js"
import mongoose from 'mongoose';
import { registration as registrationService, initateRegistration as initateRegistrationService, emailOtpVerification as emailOtpVerificationService, initatePasswordReset as initatePasswordResetService, resetPassword as resetPasswordService, resetPasswordOtpValidation as resetPasswordOtpValidationService, onBoardingData as onBoardingDataService, getUser as getUserService, inviteTeamMember as inviteTeamMemberService, invitedIdToSession as invitedIdToSessionService, deleteUserAccount as deleteUserAccountService } from "./service.js"
import { createOrganization } from "../organization/service.js"
import { loginResponse } from "../auth/dto.js"
import { updateUserWithOrganization as updateUserWithOrganizationService } from "./service.js";
import { invitedIdToSession } from "./service.js";
import { getUsersOfOrganization as getUsersOfOrganizationService } from "./service.js";
import { registerTeamMemberStep1, registerTeamMemberStep2 } from "./service.js";
import { editRoleOfTeamMember as editRoleOfTeamMemberService, deletePendingInvitation as deletePendingInvitationService } from "./service.js";

// Multer configuration
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // Accept image files only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}).fields([
    { name: 'user_profileImage', maxCount: 1 },
    { name: 'organization_logo', maxCount: 1 }
]);


export const initateRegistration = async (req, res, next) => {
    try {
        const data = validateAndSanitizeInitateRegistration(req.body);
        const response = await initateRegistrationService(data);

        return res.status(200).json({ message: "User initiated registration successfully. Please verify your email ID." });

    } catch (error) {
        next(error);
    }
}

export const emailOtpVerification = async (req, res, next) => {
    try {

        const data = validateAndSanitizeOTPValidation(req.body);
        const response = await emailOtpVerificationService(data);

        return res.status(200).json(loginResponse(response));

    } catch (error) {
        next(error);
    }
}

export const register = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            next(new Error('A Multer error occurred when uploading.'));
        } else if (err) {
            next(err);
        }

        try {
            const session = await mongoose.startSession();
            session.startTransaction();

            try {

                const { user_profileImage, organization_logo } = req.files;
                const { userId } = req.user;

                if (user_profileImage) {
                    const user_profileImageKey = await uploadFileToS3(user_profileImage[0], 'userProfileImage');

                    req.body.user_profileImage = user_profileImageKey?.key;
                }

                if (organization_logo) {
                    const organization_logoKey = await uploadFileToS3(organization_logo[0], 'organizationLogo');
                    req.body.organization_logo = organization_logoKey?.key;
                }



                const step = req.params.step;





                const data = validateAndSanitizeRegistrationData(req.body, step);
                data.userId = userId;

                const reponse = await registrationService(data, session);
                if (!reponse) {
                    throw new Error("Error creating user");
                }

                await session.commitTransaction();
                session.endSession();

                res.status(201).json({ message: "User registered successfully.Please verify your email ID." });
            }
            catch (err) {
                await session.abortTransaction();
                session.endSession();
                throw err;
            }

        } catch (error) {
            next(error);
        }
    });
};

export const initatePasswordReset = async (req, res, next) => {
    try {

        const data = validateAndSanitizeInitateRegistration(req.body);
        const response = await initatePasswordResetService(data);
        res.send(response);
    } catch (error) {
        next(error);
    }
}

export const resetPasswordOtpValidation = async (req, res, next) => {
    try {

        const data = validateAndSanitizeOTPValidation(req.body);
        const response = await resetPasswordOtpValidationService(data);
        res.send(response);

    } catch (error) {
        next(error);
    }
}

export const resetPassword = async (req, res, next) => {
    try {

        const userId = req.user.userId;
        const data = validateAndSanitizeResetPassword(req.body);
        data.userId = userId;
        const response = await resetPasswordService(data);
        res.send(response);

    } catch (error) {
        next(error);
    }
}


export const onBoardingData = async (req, res, next) => {
    try {

        const userId = req.user.userId;
        const reponse = await onBoardingDataService({ userId });
        res.send(reponse);

    } catch (error) {
        next(error);
    }
}

export const updateUserWithOrganization = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            next(new Error('A Multer error occurred when uploading.'));
        } else if (err) {
            console.log(err);
            next(err);
        }

        try {
            const { organization_logo, user_profileImage } = req.files;
            const { userId } = req.user;

            if (organization_logo) {
                const organization_logoKey = await uploadFileToS3(organization_logo[0], 'organizationLogo');
                req.body.organization_logo = organization_logoKey?.key;
            }

            if (user_profileImage) {
                const user_profileImageKey = await uploadFileToS3(user_profileImage[0], 'userProfileImage');
                req.body.user_profileImage = user_profileImageKey?.key;
            }

            const data = validateAndSanitizeUserAndOrganizationUpdate(req.body);
            data.userId = userId;


            const response = await updateUserWithOrganizationService(data);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    });
};


export const getUser = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const populateOrganization = req.query.organizationDetails == "false" ? false : true;// Default to true if not specified
        const user = await getUserService(userId, populateOrganization);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};


export const inviteTeamMembers = async (req, res) => {
    try {
        const { organization } = req.user;

        const members = validateAndSanitizeTeamMembers(req.body);


        const invitationResults = await inviteTeamMemberService({ members, organizationId: organization });

        res.status(200).json({
            success: true,
            message: 'Team member invitations processed',
            data: invitationResults
        });
    } catch (error) {
        console.error('Error in inviteTeamMemberController:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to invite team members',
            error: error.message
        });
    }
};

export const acceptInvitation = async (req, res, next) => {
    try {
        const { invitedId } = req.params;

        if (!invitedId) {
            return res.status(400).json({ message: "Invitation ID is required" });
        }

        const result = await invitedIdToSessionService(invitedId);

        return res.status(200).json({
            message: "Invitation accepted successfully",
            token: result.token,
            user: result.user
        });

    } catch (error) {
        next(error);
    }
};

export const getUsersOfOrganization = async (req, res, next) => {
    try {
        const { organization } = req.user;
        const { role, status } = req.query;

        const users = await getUsersOfOrganizationService({
            organizationId: organization,
            role,
            invitedStatus: status
        });

        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        next(error);
    }
};


export const registerTeamMember = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            next(new Error('A Multer error occurred when uploading.'));
        } else if (err) {
            console.log(err);
            next(err);
        }

        try {
            const { step } = req.params;
            const { userId } = req.user;

            if (step === '1') {
                const { user_profileImage } = req.files;
                if (user_profileImage) {
                    const user_profileImageKey = await uploadFileToS3(user_profileImage[0], 'userProfileImage');
                    req.body.user_profileImage = user_profileImageKey?.key;
                }

                const data = validateAndSanitizeTeamMemberStep1(req.body);
                data.userId = userId;

                const response = await registerTeamMemberStep1(data);
                res.status(200).json(response);
            } else if (step === '2') {
                const data = validateAndSanitizeTeamMemberStep2(req.body);
                data.userId = userId;

                const response = await registerTeamMemberStep2(data);
                res.status(200).json(response);
            } else {
                throw new Error('Invalid step');
            }
        } catch (error) {
            next(error);
        }
    });
};

export const editRoleOfTeamMember = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const { organization } = req.user;


        const response = await editRoleOfTeamMemberService({ id, role, organizationId: organization });

        res.status(200).json({
            success: true,
            message: 'Team member role updated successfully',
            data: response
        });
    } catch (error) {
        next(error);
    }
};

export const deletePendingInvitation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { organization } = req.user;

        const response = await deletePendingInvitationService({
            id,
            organizationId: organization
        });

        res.status(200).json({
            success: true,
            message: 'Invitation deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUserAccount = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const response = await deleteUserAccountService(userId);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};
