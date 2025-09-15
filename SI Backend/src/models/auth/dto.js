export const loginResponse = ({ token }) => {
    return { data: { token }, message: "Login successful" }
}

export const validateAndSanitizeLogin = (loginData) => {
    const { user_email, user_password, userType } = loginData;
    if (!user_email || !user_password) {
        throw new Error("Email and password are required");
    }

    const sanitizedEmail = user_email.toLowerCase().trim();
    if (!sanitizedEmail.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
        throw new Error('Invalid credentials');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(user_password)) {
        throw new Error('Invalid credentials');
    }

    return {
        email: sanitizedEmail,
        password: user_password,
        userType: userType && userType === "superAdmin" ? "superAdmin" : "normal"
    };
}