import Joi from 'joi';
import { getKPIData } from "../report/dto.js";


const valueSchema = Joi.object({
    value: Joi.number().allow(null)
});

export const validateSocialKPI = (data) => {
    const schema = Joi.object({
        S1: Joi.object({
            totalMen: valueSchema,
            totalWomen: valueSchema,
            totalNonBinary: valueSchema
        }),
        S2: Joi.object({
            foreignEmployees: valueSchema
        }),
        S3: Joi.object({
            directEmployees: valueSchema,
            indirectEmployees: valueSchema
        }),
        S4: Joi.object({
            averageTenure: valueSchema
        }),
        S5: Joi.object({
            trainingHours: valueSchema
        }),
        S6: Joi.object({
            nonDiscriminatoryPolicy: Joi.object({
                value: Joi.boolean().allow(null)
            })
        }),
        S7: Joi.object({
            trir: valueSchema
        }),
        S8: Joi.object({
            campusHires: valueSchema
        })
    });

    const { value, error } = schema.validate(data, { abortEarly: false });
    if (error)
        throw error;

    return value;
};

export const getSocialKPIDTO = (data, withLastApprovalStatus, sendForApprovalLastId, role, userId) => {
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
    const kpis = Object.keys(data).filter(key => key.match(/^S\d+$/));
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
//     let kpiObject = isRestrictedUser ? {} : {
//         score: kpiData?.score,
//         approval: withLastApprovalStatus && getApprovalDTO(kpiData, sendForApprovalLastId, role)
//     };

//     const keysNot = ["score"];

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
    validateSocialKPI,
    getSocialKPIDTO,
};
