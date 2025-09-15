import Joi from 'joi';
import mongoose from 'mongoose';
import { getKPIData } from "../report/dto.js";

const valueSchema = Joi.object({
    value: Joi.number().allow(null)
});

export const validateEnvironmentKPI = (data) => {
    const schema = Joi.object({
        E1: Joi.object({
            scope1Emissions: valueSchema,
            scope2Emissions: valueSchema
        }),
        E2: Joi.object({
            scope3Emissions: valueSchema
        }),
        E3: Joi.object({
            waterConsumed: valueSchema
        }),
        E4: Joi.object({
            wasteToLandfill: valueSchema
        }),
        E5: Joi.object({
            noxReleased: valueSchema
        }),
        E6: Joi.object({
            soxReleased: valueSchema
        }),
        E7: Joi.object({
            h2sConcentration: valueSchema
        }),
        E8: Joi.object({
            noiseLevel: valueSchema
        }),
        E9: Joi.object({
            wasteWaterTreated: valueSchema,
            totalWasteWater: valueSchema
        })
    });

    const { value, error } = schema.validate(data, { abortEarly: false });
    if (error)
        throw error;

    return value;
};

export const getEnvironmentKPIDTO = (data, withLastApprovalStatus, sendForApprovalLastId, role, userId) => {
    const isRestrictedUser = role && role !== "admin" && role !== "super_admin";
    data = typeof data.toJSON === 'function' ? data.toJSON() : data;

    const kpiData = {
        id: data._id,
        ...(isRestrictedUser ? {} : {
            score: data?.score,
            grade: data?.grade,
            completedStatus: data?.completedStatus,
            unReadMessages: data?.unReadMessages,
        })
    };

    // Get all KPI keys dynamically
    const kpis = Object.keys(data).filter(key => key.match(/^E\d+$/));
    kpis.forEach(kpi => {
        const assignUsers = data[kpi].assign && data[kpi].assign.assignMembers ?
            data[kpi].assign.assignMembers.map(userId => userId.toString()) :
            [];
        if (!isRestrictedUser || assignUsers.includes(userId)) {
            kpiData[kpi] = getKPIData(data[kpi], withLastApprovalStatus, sendForApprovalLastId, role, isRestrictedUser);
        }
    });

    return kpiData;
};

// const getKPIData = (kpiData, withLastApprovalStatus, sendForApprovalLastId, role, isRestrictedUser) => {
//     let kpiObject = isRestrictedUser ? {
//         assign: kpiData?.assign,
//     } : {
//         assign: kpiData?.assign,
//         score: kpiData?.score,
//         approval: withLastApprovalStatus && getApprovalDTO(kpiData, sendForApprovalLastId, role)
//     };

//     const keysNot = ["assign", "score"];

//     // Dynamically add all value-unit-formula fields
//     Object.keys(kpiData).forEach(key => {
//         if (!keysNot.includes(key) && typeof kpiData[key] === 'object' && kpiData[key] !== null) {
//             kpiObject[key] = getValueUnitFormulaDTO(kpiData[key]);
//         }
//     });

//     return kpiObject;
// };

// const getValueUnitFormulaDTO = (data) => {
//     return {
//         value: data?.value,
//         unit: data?.unit,
//         formula: data?.formula,
//     };
// };

// const getApprovalDTO = (data, sendForApprovalLastId, role) => {
//     const lastApproval = data.approvalSchema[data.approvalSchema.length - 1];
//     return {
//         ...lastApproval,
//         ...(role === "super_admin" ? { resubmit: sendForApprovalLastId?.toString() == lastApproval.senderForVerification?.toString() } : {})
//     };
// };

export default {
    validateEnvironmentKPI,
    getEnvironmentKPIDTO,
};
