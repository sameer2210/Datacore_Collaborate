import mongoose, { Mongoose } from 'mongoose';

const attachmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    key: {
        type: String,
        required: true,
    }
});

const chatSchema = mongoose.Schema({
    message: {
        type: String,
        default: ''
    },
    attachment: {
        type: [attachmentSchema],
        default: []
    },
    createdBy: {
        type:  mongoose.Schema.Types.ObjectId,
        required: true,
        default: 1
    },
    updatedBy: {
        type:  mongoose.Schema.Types.ObjectId,
        required: true,
        default: 1
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    reportId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    kpiName: {
        type: ["basicSectorSpecificKPI", "environmentKPI", "governmentKPI", "socialKPI"],
        required: true
    },
    code: {
        type: String
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    }
}, { timestamps: true });

const lastMessageFechSchema = mongoose.Schema({
    reportId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    kpiName: {
        type: ["basicSectorSpecificKPI", "environmentKPI", "governmentKPI", "socialKPI"],
        required: true
    },
    code: {
        type: String
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    lastMessageFetch: {
        type: Date,
        default: Date.now
    },
});

export const Chat = mongoose.model('Chat', chatSchema);
export const LastMessageFetch = mongoose.model('LastMessageFetch', lastMessageFechSchema);

