import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        enum: ['email_verification', "password_reset"],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Document will automatically be deleted after 5 minutes (300 seconds)
    },
    isUsed: {
        type: Boolean,
        default: false
    }
});

const OTP = mongoose.model('OTP', OTPSchema);

export default OTP;
