import mongoose from "mongoose";
import { approvalSchema, assignSchema } from "../report/model.js";

const socialKPISchema = new mongoose.Schema({
    S1: {
        totalMen: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562307b0aeb0cb6660b7' },
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        totalWomen: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562307b0aeb0cb6660b7' },
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        totalNonBinary: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562307b0aeb0cb6660b7' },
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    S2: {
        foreignEmployees: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562307b0aeb0cb6660b7' },
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    S3: {
        directEmployees: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562307b0aeb0cb6660b7' },
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        indirectEmployees: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562307b0aeb0cb6660b7' },
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    S4: {
        averageTenure: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562307b0aeb0cb6660b9' },
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    S5: {
        trainingHours: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562307b0aeb0cb6660bb' },
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    S6: {
        nonDiscriminatoryPolicy: {
            value: { type: Boolean },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562307b0aeb0cb6660bd' },
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    S7: {
        trir: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562307b0aeb0cb6660bf' },
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    S8: {
        campusHires: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562307b0aeb0cb6660b7' },
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    score: { type: Number },
    grade: {
        type: String
    },
    completedStatus: {
        total: Number,
        done: Number
    }
}, { timestamps: true });

const SocialKPI = mongoose.model('SocialKPI', socialKPISchema);
export default SocialKPI;
