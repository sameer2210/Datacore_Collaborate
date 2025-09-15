import mongoose from "mongoose";
import { approvalSchema, assignSchema } from "../report/model.js";

const governmentKPISchema = new mongoose.Schema({
    G1: {
        taxReliefReceived: {
            value: { type: Boolean },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562307b0aeb0cb6660bd' }, // 0/1
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    G2: {
        pensionContribution: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb6660ab' }, // %
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    G3: {
        localSuppliersSpending: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb66609d' }, // %
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    G4: {
        newSuppliersSpending: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb66609d' }, // %
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    G5: {
        localCommunitiesSpending: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb66609d' }, // %
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    G6: {
        innovativeTechnologiesSpending: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb66609d' }, // %
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    G7: {
        ethicsPolicyInPlace: {
            value: { type: Boolean },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562307b0aeb0cb6660bd' }, // 0/1
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    G8: {
        totalComplaints: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562307b0aeb0cb6660b7' }, // Number
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        resolvedComplaints: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562307b0aeb0cb6660b7' }, // Number
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    G9: {
        boardMembers: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562307b0aeb0cb6660b7' }, // Number
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    G10: {
        csrSpending: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb66609d' }, // %
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    score: {
        type: Number
    },
    grade: {
        type: String
    },
    completedStatus: {
        total: Number,
        done: Number
    }
}, { timestamps: true });

const GovernmentKPI = mongoose.model('GovernmentKPI', governmentKPISchema);
export default GovernmentKPI;