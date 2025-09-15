import mongoose from "mongoose";
import { approvalSchema, assignSchema } from "../report/model.js";

const basicSectorSpecificKPISchema = new mongoose.Schema({
    B1: {
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
        grossRevenue: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb66609d' }, // million USD
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    B2: {
        totalWaterConsumption: {
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
    B3: {
        totalHazardousWaste: {
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
    B4: {
        totalNonHazardousWaste: {
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
    B5: {
        Y1: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb6660ab' }, // %
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
        },
        Y2: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb6660ab' }, // %
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
        },
        Y3: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb6660ab' }, // %
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
        },
        kpiValue: { type: Number },
        normalizedValue: { type: Number },
        score: { type: Number },
        approvalSchema: [approvalSchema],
        assign: assignSchema
    },
    B6: {
        totalElectricityConsumption: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb6660ad' }, // MWh
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
        },
        electricityFromGrid: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb6660ad' }, // MWh
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
        },
        recPurchased: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb6660af' }, // MWh eq
            formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
        },
        electricityFromRenewables: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: '66d7562207b0aeb0cb6660ad' }, // MWh
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

const BasicSectorSpecificKPI = mongoose.model('BasicSectorSpecificKPI', basicSectorSpecificKPISchema);
export default BasicSectorSpecificKPI;


