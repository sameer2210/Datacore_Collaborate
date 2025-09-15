import mongoose from 'mongoose';

const subscriptionPlanSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: Number, // in months
        required: true,
        min: 1
    },
    features: {
        numberOfMembers: {
            type: Number,
            required: true,
            default: -1
        },
        numberOfVettiedReports: {
            type: Number,
            required: true,
            default: -1
        },
        numberOfReports:{
            type: Number,
            default: -1,
            required: false
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    currency: {
        type: String,
        default: 'USD',
        required: true
    },
    defaultPlan:{
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, { timestamps: true });


const InitiatePaymentSchema = mongoose.Schema({
    planId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    planType: {
        type: String,
        enum: ['addOn', 'subscriptionPlan'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    planPrice: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    currency: {
        type: String,
        required: true
    }
}, { timestamps: true });

const quotaSchema = mongoose.Schema({
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    numberOfMembers: {
        type: Number,
        required: true
    },
    numberOfVettiedReports: {
        type: Number,
        required: true
    },
    numberOfReports: {
        type: Number,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, { timestamps: true });

// Indexes for better query performance
subscriptionPlanSchema.index({ status: 1 });
subscriptionPlanSchema.index({ price: 1 });
subscriptionPlanSchema.index({ duration: 1 });

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
const InitiatePayment = mongoose.model('InitiatePayment', InitiatePaymentSchema);
const Quota = mongoose.model('Quota', quotaSchema);

export { SubscriptionPlan, InitiatePayment, Quota };
