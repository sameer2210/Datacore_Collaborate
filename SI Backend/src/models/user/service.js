import User from './model.js';
import Organization from '../organization/model.js';
import Report from '../report/model.js';
import { createOrganization, validateOrganization, getOrganizationById } from '../organization/service.js';
import { createSession } from "../auth/service.js"
import { createOTP, validateOTP } from "../otp/service.js";
import { forgotPasswordJwtKey } from '../../config/config.js';
import jwt from 'jsonwebtoken';
import { sendOTPVerificationEmail, sendOTPForgotPassword, sendResetPasswordSuccessfulNotification } from "../../util/sendgrid.js";
import { userResponseDto } from "./dto.js";
import { updateOrganization } from '../organization/service.js';
import { sendTeamMemberInvitationEmail } from "../../util/sendgrid.js";
import mongoose from 'mongoose'; // Import mongoose for ObjectId
import {avtivateDefaultPlan} from "../substribtionPlan/service.js";

export async function initateRegistration(userData) {
    try {
        const { email } = userData;

        let user = await User.findOne({ email: email });

        if (user && user.isDummy == false) {
            throw new Error("User already exists");
        }
        else if (!user) {
            user = new User({ email, isDummy: true });
            await user.save();
        }

        //send otp
        const otpData = { userId: user._id, purpose: 'email_verification' };
        const otpResponse = await createOTP(otpData);
        const sendOtpResponse = await sendOTPVerificationEmail(email, otpResponse.otp);
        return { message: "User initiated registration successfully. Please verify your email ID." };
    } catch (error) {
        throw error;
    }
}

export async function registration(userData) {
    try {
        const { step } = userData;

        switch (step) {
            case "1":
                return registrationSep1(userData);

            case "2":
                return registrationSep2(userData);
            case "3":
                return registrationSep3(userData);
            default:
                throw new Error('Invalid step');
        }



    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
}

export async function registrationSep1(data) {
    try {
        const { password, userId } = data;
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("Invalid user");
        }

        user.password = password;
        await user.save();

        return { message: "Step 1 completed successfully" };

    } catch (error) {
        throw error;
    }

}

export async function registrationSep2(data) {
    try {
        const { name, profileImage, userId } = data;
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("Invalid user");
        }

        user.name = name;

        if (profileImage)
            user.profileImage = profileImage;

        await user.save();

        return { message: "Step 2 completed successfully" };
    } catch (error) {
        throw error;
    }
}

export async function registrationSep3(data) {
    try {
        const { organization, userId } = data;
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("Invalid user");
        }
        const organizationResponse = await createOrganization(organization);
        if (!organizationResponse) {
            throw new Error("Error creating organization");
        }

        user.organization = organizationResponse._id;
        user.role = 'admin';
        user.isDummy = false;
        await user.save();
        await avtivateDefaultPlan(userId);

        return { message: "User registered successfully" };
    }
    catch (error) {
        throw error;
    }
}

export async function emailOtpVerification(data) {
    try {
        const { email, otp } = data;
        //otp validation
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Invalid email");
        }

        const otpData = { userId: user._id, otp, purpose: 'email_verification' };
        await validateOTP(otpData);

        user.isEmailVerified = true;
        await user.save();

        const { token } = await createSession({ userId: user._id });
        return { token };

    } catch (error) {
        throw error;
    }
}

export async function validateUserLoginDetails(loginData) {
    try {

        const user = await User.findOne({ email: loginData.email, isDummy: false })
        .populate({
            path: 'organization',
            select: 'status name', 
        });

        if (!user) {
            throw new Error("Invalid login credentials");
        }

        const isMatch = await user.comparePassword(loginData.password);
        if (!isMatch) {
            throw new Error("Invalid login credentials");
        }

        // Check if the user's organization is blocked
        const organization = user.organization;
        if (organization && organization.status === 'block') {
            throw new Error(`Your company ${organization.name} is blocked.`);
        }

        return user;

    } catch (error) {
        throw error;
    }

}

export async function validateUserType(query) {
    try {
        const user = await User.findOne(query);

        if (!user) {
            throw new Error("Invalid user");
        }

        return { validate: true };
    } catch (error) {
        throw error;
    }

}

export async function organizationIdFromUserId({ userId }) {
    try {
        const user = await User.findOne({ _id: userId, isDummy: false, softDelete: false });

        if (!user)
            throw new Error("User Not Exist.");

        return { organizationId: user.organization }
    } catch (error) {
        throw error;
    }
}

export async function initatePasswordReset({ email }) {
    try {

        const user = await User.findOne({ email: email, isDummy: false, softDelete: false });
        if (!user)
            throw new Error("User not found. Please check the email provided.");

        const otpData = { userId: user._id, purpose: 'password_reset' };
        const otpResponse = await createOTP(otpData);
        const sendOtpResponse = await sendOTPForgotPassword(email, otpResponse.otp);

        return { message: "Password reset initiated successfully. Please check your email for the OTP." };

    } catch (error) {
        throw error;
    }
}

export async function resetPassword({ userId, password }) {
    try {
        const user = await User.findOne({ _id: userId, isDummy: false, softDelete: false });
        if (!user) {
            throw new Error("User not found");
        }

        const isMatch = await user.comparePassword(password);

        if (isMatch) {
            throw new Error("New password cannot be the same as the old password.");
        }

        user.password = password;
        await user.save();

        await sendResetPasswordSuccessfulNotification(user.email)
        return { message: "Password reset successfully" };

    } catch (error) {

        throw error;
    }
}

export async function resetPasswordOtpValidation({ email, otp }) {
    try {

        const user = await User.findOne({ email: email, isDummy: false, softDelete: false });
        if (!user) {
            throw new Error("User not found");
        }

        const otpData = { userId: user._id, otp, purpose: 'password_reset' };
        await validateOTP(otpData);

        const token = jwt.sign({ userId: user._id }, forgotPasswordJwtKey, { expiresIn: '5m' });

        return { token: token };
    } catch (error) {
        throw error;
    }

}

export async function onBoardingData({ userId }) {
    try {
        const user = await User.findById(userId);
        if (user?.organization) {
            const organization = await getOrganizationById(user.organization);
            user.organization = organization;
        }

        return userResponseDto(user);

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUser(userId, populateOrganization = true) {
    try {
        let query = User.findById(userId);

        if (populateOrganization) {
            query = query.populate({
                path: 'organization',
                populate: [
                    { path: 'employeeCount' },
                    { path: 'country' },
                    { path: 'averageRevenue' },
                    { path: 'sector' },
                    { path: 'industry' }
                ]
            });
        }

        const user = await query.exec();

        if (!user) {
            throw new Error("User not found");
        }

        return userResponseDto(user);
    } catch (error) {
        throw error;
    }
}

export async function updateUserWithOrganization(data) {
    try {
        const { userId, name, profileImage, phone, organization } = data;

        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        if (name) user.name = name;
        if (profileImage) user.profileImage = profileImage;
        if (phone) user.phone = phone;

        await user.save();

        let updatedOrganization;
        if (organization && Object.keys(organization).length > 0) {
            updatedOrganization = await updateOrganization(user.organization, organization);
        }

        return await getUser(userId);
    } catch (error) {
        throw error;
    }
}

export async function getUsersOnOrganization({ organization, role }) {
    try {
        const query = { organization };
        if (role) query.role = role;

        const users = await User.find(query);

        return users.map((user) => {
            return userResponseDto(user);
        });
    } catch (error) {
        throw error; // Proper error handling
    }
}

export async function inviteTeamMember({ members, organizationId }) {
    try {
        const organization = await getOrganizationById({ orgId: organizationId });
        if (!organization)
            throw new Error("Organization not found");

        const invitationResults = await Promise.all(members.map(async (member) => {
            const { email, role } = member;

            // Check if user already exists
            let user = await User.findOne({ email });
            if (!user) {
                user = new User({

                    email,
                    isDummy: true,
                    organization: organizationId,
                    role: role,
                    invited: {
                        status: "pending",
                        invitedDate: new Date()
                    }
                });
                await user.save();

                await sendTeamMemberInvitationEmail(email, organization.name, user.invited._id);

                return { email, status: 'invited', message: 'Invitation sent successfully' };
            } else if (user.organization && user.organization.toString() === organizationId.toString()) {
                throw new Error("User already exists in organization")
            } else {
                throw new Error("User already exists in another organization")
            }

        }));

        return invitationResults;
    } catch (error) {
        console.error('Error in inviteTeamMember:', error);
        throw new Error(`Failed to invite team members: ${error.message}`);
    }
}

export async function invitedIdToSession(invitedId) {
    try {
        // Find the user with the given invitedId
        const user = await User.findOne({ 'invited._id': new mongoose.Types.ObjectId(invitedId) });

        if (!user) {
            throw new Error('Invalid invitation ID');
        }

        if (user.invited.status !== 'pending') {
            throw new Error('Invitation is no longer valid');
        }
        const { token } = await createSession({ userId: user._id });

        return { token, user: userResponseDto(user) };
    } catch (error) {
        console.error('Error in invitedIdToSession:', error);
        throw new Error(`Failed to create session from invitation: ${error.message}`);
    }
}

export async function getUsersOfOrganization({ organizationId, role, invitedStatus }) {
    try {
        const query = { organization: organizationId, softDelete: false };
        if (role) query.role = role;

        // Handle invitedStatus
        if (invitedStatus === 'pending') {
            query.isDummy = true;
            query['invited.status'] = 'pending';
        } else if (invitedStatus === 'accepted') {
            query.isDummy = false;
        }

        const users = await User.find(query)
            .sort({ createdAt: -1 });

        return users.map(user => userResponseDto(user));
    } catch (error) {
        console.error('Error in getUsersOfOrganization:', error);
        throw new Error(`Failed to get users of organization: ${error.message}`);
    }
}

export async function updateLastActive(userId) {
    try {
        const user = await User.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(userId) },
            { $set: { lastActive: new Date() } },
            { new: true, runValidators: true }
        );

        if (!user) {
            throw new Error('User not found');
        }


        return userResponseDto(user);
    } catch (error) {
        console.error('Error in updateLastActive:', error);
        throw new Error(`Failed to update last active timestamp: ${error.message}`);
    }
}

export async function registerTeamMemberStep1(data) {
    try {
        const { name, profileImage, userId } = data;
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("Invalid user");
        }

        user.name = name;
        if (profileImage) {
            user.profileImage = profileImage;
        }

        await user.save();

        return { message: "Team member registration step 1 completed successfully" };
    } catch (error) {
        throw error;
    }
}

export async function registerTeamMemberStep2(data) {
    try {
        const { password, userId } = data;
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("Invalid user");
        }

        if (!user.name) {
            throw new Error("User name is required. Please complete step 1 first.");
        }

        user.password = password;
        user.isDummy = false;
        user.invited.status = 'accepted';
        await user.save();

        return { message: "Team member registered successfully" };
    } catch (error) {
        throw error;
    }
}

export async function editRoleOfTeamMember(data) {
    try {
        const { id, role, organizationId } = data;

        // Validate role
        const validRoles = ['viewer', 'member']; // Add other valid roles if needed
        if (!validRoles.includes(role)) {
            throw new Error('Invalid role specified');
        }

        // Find and update the user
        const user = await User.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(id),
                organization: new mongoose.Types.ObjectId(organizationId),

            },
            { $set: { role: role } },
            { new: true, runValidators: true }
        );

        if (!user) {
            throw new Error('User not found');
        }

        return userResponseDto(user);
    } catch (error) {
        console.error('Error in editRoleOfTeamMember:', error);
        throw new Error(`Failed to update team member role: ${error.message}`);
    }
}

export async function deletePendingInvitation(data) {
    try {
        const { id, organizationId } = data;

        // Find and delete the pending invitation
        const user = await User.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(id),
            organization: new mongoose.Types.ObjectId(organizationId),
            isDummy: true,
            'invited.status': 'pending'
        });

        if (!user) {
            throw new Error('Pending invitation not found or already accepted');
        }

        return { message: 'Invitation deleted successfully' };
    } catch (error) {
        console.error('Error in deletePendingInvitation:', error);
        throw new Error(`Failed to delete invitation: ${error.message}`);
    }
}

export async function deleteUserAccount(userId) {
    try {
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const organizationId = user.organization;

        // Delete user
        await User.findByIdAndDelete(userId);

        if (organizationId) {

            // Delete all users associated with the organization
            await User.deleteMany({ organization: organizationId });

            // Delete all reports linked to this organization
            await Report.deleteMany({ 'organizationDetails.organization': organizationId });

            // Delete the organization
            await Organization.findByIdAndDelete(organizationId);
        }

        return { message: 'User deleted successfully' };
    } catch (error) {
        console.error('Error in deleteUserAccount:', error);
        throw new Error(`Failed to delete user account: ${error.message}`);
    }
}
