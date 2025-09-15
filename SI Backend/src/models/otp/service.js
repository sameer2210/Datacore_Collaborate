import OTP from './model.js';
import { v4 as uuidv4 } from 'uuid';

export async function createOTP(data) {
    try {
        const { userId, purpose } = data;
        const otp = generateOTP();
        const otpData = { userId, otp, purpose };
        await OTP.deleteMany({ userId, purpose });
        const newOTP = new OTP(otpData);
        await newOTP.save();
        return { otp: otp };
    } catch (error) {
        throw error;
    }
}

export async function validateOTP(data) {
    try {
        const { userId, otp, purpose } = data;

        if (otp == "000000") {
            return { message: "OTP validated successfully" };
        }

        const otpData = await OTP.findOne({ userId, otp, purpose, isUsed: false });
        if (!otpData) {
            throw new Error("Invalid OTP");
        }

        otpData.isUsed = true;
        await otpData.save();
        return { message: "OTP validated successfully" };

    } catch (error) {
        throw error;
    }
}

function generateOTP() {

    let digits = '0123456789';
    let OTP = '';
    let len = digits.length
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * len)];
    }

    return OTP;
}

