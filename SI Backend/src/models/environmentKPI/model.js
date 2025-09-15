import mongoose from "mongoose";
import { approvalSchema, assignSchema } from "../report/model.js";


const environmentKPISchema = new mongoose.Schema({
    E1: {
        scope1Emissions: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562107b0aeb0cb66609a' }, // tCO2e
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
        },
        scope2Emissions: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562107b0aeb0cb66609a' }, // tCO2e
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    E2: {
        scope3Emissions: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562107b0aeb0cb66609a' }, // tCO2e
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    E3: {
        waterConsumed: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb6660a4' }, // m3
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    E4: {
        wasteToLandfill: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb6660a9' }, // %
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    E5: {
        noxReleased: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb6660a9' }, // tonnes
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    E6: {
        soxReleased: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb6660a9' }, // tonnes
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    E7: {
        h2sConcentration: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb6660b1' }, // ppm
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    E8: {
        noiseLevel: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb6660b3' }, // dB
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    E9: {
        wasteWaterTreated: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb6660a4' }, // %
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
        },
        totalWasteWater: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb6660a4' }, // m3
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
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

const EnvironmentKPI = mongoose.model('EnvironmentKPI', environmentKPISchema);
export default EnvironmentKPI;
