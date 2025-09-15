import { validateAndSanitizeOrganization, validateAndSanitizeOrganizationUpdate, responseOrganizationDTO } from '../organization/dto.js';

export const validateAndSanitizeInitateRegistration = (data) => {

    const { user_email } = data;

    const sanitizedEmail = user_email.toLowerCase().trim();
    if (!sanitizedEmail.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
        throw new Error('Invalid email format');
    }

    return {
        email: sanitizedEmail,
    };
}

export const validateAndSanitizeRegistrationData = (data, step) => {
    try {
        switch (step) {
            case "1":
                return validateAndSanitizeRegistrationDataSetp1(data);
            case "2":
                return validateAndSanitizeRegistrationDataSetp2(data);
            case "3":
                return validateAndSanitizeRegistrationDataSetp3(data);
            default:
                throw new Error('Invalid step');
        }
    } catch (error) {
        throw error;
    }
};

export const validateAndSanitizeRegistrationDataSetp1 = (data) => {
    const { user_password } = data;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!user_password || !passwordRegex.test(user_password)) {
        throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    return {
        password: user_password,
        step: "1"
    };
};

export const validateAndSanitizeRegistrationDataSetp2 = (data) => {
    const { user_name, user_profileImage } = data;

    if (!user_name || user_name.trim().length < 2 || user_name.trim().length > 50) {
        throw new Error('Name must be between 2 and 50 characters');
    }

    return {
        name: user_name.trim(),
        profileImage: user_profileImage,
        step: "2",
    };
};

export const validateAndSanitizeRegistrationDataSetp3 = (data) => {
    const organization = validateAndSanitizeOrganization(data);
    return { organization: organization, step: "3" };
}

export const validateAndSanitizeOTPValidation = (data) => {
    const { user_email, user_otp } = data;

    const sanitizedEmail = user_email.toLowerCase().trim();
    if (!sanitizedEmail.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
        throw new Error('Invalid email format');
    }

    if (!user_otp || user_otp.trim().length < 4) {
        throw new Error('OTP cannot be empty');
    }

    return {
        email: sanitizedEmail,
        otp: user_otp
    };

}

export const validateAndSanitizeInitateResetPassword = (data) => {
    const { user_email } = data;

    const sanitizedEmail = user_email.toLowerCase().trim();
    if (!sanitizedEmail.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
        throw new Error('Invalid email format');
    }

    return {
        email: sanitizedEmail,
    };
}

export const validateAndSanitizeResetPassword = (data) => {
    const { user_password, user_confirm_password } = data;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!user_password || !passwordRegex.test(user_password)) {
        throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    if (user_password !== user_confirm_password) {
        throw new Error('Passwords do not match');
    }

    return {
        password: user_password,
    };
};

export const userResponseDto = (data) => {
    return {
        id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: !!data.password && data.password.length > 0,
        profileImage: data.profileImage,
        role: data.role,
        invited: data.invited,
        lastActive: data.lastActive,
        organization: typeof data.organization === 'object' ? responseOrganizationDTO(data.organization) : data.organization
    };
};

export const validateAndSanitizeUserAndOrganizationUpdate = (data) => {
    const { user_name, user_profileImage, user_phone } = data;

    const sanitizedData = {};

    if (user_name) {
        if (user_name.trim().length < 2 || user_name.trim().length > 50) {
            throw new Error('Name must be between 2 and 50 characters');
        }
        sanitizedData.name = user_name.trim();
    }

    if (user_profileImage) {
        sanitizedData.profileImage = user_profileImage;
    }

    if (user_phone) {
        // Add phone number validation if needed
        sanitizedData.phone = user_phone;
    }

    const organizationData = validateAndSanitizeOrganizationUpdate(data);

    if (Object.keys(organizationData).length > 0) {
        sanitizedData.organization = organizationData;
    }

    return sanitizedData;
};

export const validateAndSanitizeTeamMembers = ({ members }) => {

    if (!Array.isArray(members) || members.length === 0) {
        throw new Error('Members must be a non-empty array');
    }

    return members.map((member, index) => {
        if (!member || typeof member !== 'object') {
            throw new Error(`Invalid member object at index ${index}`);
        }

        const { email, role } = member;

        // Validate and sanitize email
        if (!email || typeof email !== 'string') {
            throw new Error(`Invalid email for member at index ${index}`);
        }
        const sanitizedEmail = email.toLowerCase().trim();
        if (!sanitizedEmail.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
            throw new Error(`Invalid email format for member at index ${index}`);
        }

        // Validate role
        if (!role || typeof role !== 'string') {
            throw new Error(`Invalid role for member at index ${index}`);
        }
        const sanitizedRole = role.toLowerCase().trim();
        if (!['viewer', 'member'].includes(sanitizedRole)) {
            throw new Error(`Invalid role for member at index ${index}. Must be either 'view' or 'member'`);
        }

        return {
            email: sanitizedEmail,
            role: sanitizedRole
        };
    });
};

export const validateAndSanitizeTeamMemberStep1 = (data) => {
    const { user_name, user_profileImage } = data;

    if (!user_name || user_name.trim().length < 2 || user_name.trim().length > 50) {
        throw new Error('Name must be between 2 and 50 characters');
    }

    return {
        name: user_name.trim(),
        profileImage: user_profileImage,
    };
};

export const validateAndSanitizeTeamMemberStep2 = (data) => {
    const { user_password } = data;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!user_password || !passwordRegex.test(user_password)) {
        throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    return {
        password: user_password,
    };
};
