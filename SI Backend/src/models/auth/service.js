import Auth from './model.js';
import { validateUserLoginDetails } from '../user/service.js';
import jwt from 'jsonwebtoken';
import { jwtKey } from './config.js';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for better token ID generation

// Function to generate JWT
async function generateJsonWebToken(userId) {
    try {
        const tokenId = uuidv4(); // Use UUID for generating a unique tokenId
        const token = jwt.sign({ userId, tokenId }, jwtKey, { expiresIn: '24h' });
        return { token: token, tokenId: tokenId };
    } catch (error) {
        throw new Error(`Error generating JWT: ${error.message}`);
    }
}

// Function to create a session
export async function login(data) {
    try {
        const { email, password, ip, userType } = data;
        const user = await validateUserLoginDetails({ email, password });
        if (!user) {
            throw new Error("Invalid login credentials");
        }

        if (userType === "superAdmin" && user.role !== "super_admin") {
            throw new Error("Invalid login credentials");
        }

        if (userType === "normal" && user.role === "super_admin") {
            throw new Error("Invalid login credentials");
        }

        return await createSession({ userId: user._id, ip: ip });

    } catch (error) {
        throw new Error(`Failed to create session: ${error.message}`);
    }
}

export async function createSession(data) {
    try {
        const { userId, ip } = data;
        const jwtData = await generateJsonWebToken(userId);
        const sessionData = {
            user: userId,
            tokenId: jwtData.tokenId,
            ip: ip
        };

        const session = new Auth(sessionData);
        await session.save();
        return { token: jwtData.token }; // Correct the return statement

    } catch (error) {
        throw new Error(`Failed to create session: ${error.message}`);
    }
}

export async function validateToken(token) {
    try {
        const decode = jwt.verify(token, jwtKey);
        const { tokenId, userId } = decode;
        const session = await Auth.findOne({ tokenId, userId, logoutAt: null });
        if (!session) {
            throw new Error("Invalid token");
        }

        return { userId: userId };

    } catch (error) {
        throw new Error(`Error validating token: ${error.message}`);
    }
}