import mongoose from 'mongoose';
import "../user/model.js";

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    loginAt: {
        type: Date,
        default: Date.now
    },
    tokenId: {
        type: String,
        required: true,
        unique: true
    },
    logoutAt: {
        type: Date,
        default: null
    },
    ip: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
