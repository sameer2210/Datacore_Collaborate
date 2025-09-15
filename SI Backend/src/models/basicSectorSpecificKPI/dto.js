import { validateAndSanitizeOrganization } from '../organization/dto.js';
import Joi from 'joi';
import { getKPIData } from "../report/dto.js";


const valueSchema = Joi.object({
    value: Joi.number().allow(null)
});

export const validateBasicSectorSpecificKPI = (data) => {
    const schema = Joi.object({
        B1: Joi.object({
            scope1Emissions: valueSchema,
            scope2Emissions: valueSchema,
            grossRevenue: valueSchema
        }),
        B2: Joi.object({
            totalWaterConsumption: valueSchema
        }),
        B3: Joi.object({
            totalHazardousWaste: valueSchema
        }),
        B4: Joi.object({
            totalNonHazardousWaste: valueSchema
        }),
        B5: Joi.object({
            Y1: valueSchema,
            Y2: valueSchema,
            Y3: valueSchema
        }),
        B6: Joi.object({
            totalElectricityConsumption: valueSchema,
            electricityFromGrid: valueSchema,
            recPurchased: valueSchema,
            electricityFromRenewables: valueSchema
        })
    });

    const { value, error } = schema.validate(data, { abortEarly: false });
    if (error)
        throw error;

    return value;
};

export const getBasicSectorKPIDTO = (data, withLastApprovalStatus, sendForApprovalLastId, role, userId) => {
    const isRestrictedUser = role && role !== "admin" && role !== "super_admin" || false;
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
    const kpis = Object.keys(data).filter(key => key.match(/^B\d+$/));
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

// const getApprovalDTO = (data, sendForApprovalLastId, role) => {
//     const lastApproval = data.approvalSchema[data.approvalSchema.length - 1];
//     return {
//         ...lastApproval,
//         ...(role === "super_admin" ? { resubmit: sendForApprovalLastId?.toString() == lastApproval.senderForVerification?.toString() } : {})
//     };
// };

// const getValueUnitFormulaDTO = (data) => {
//     return {
//         value: data?.value,
//         unit: data?.unit,
//         formula: data?.formula,
//     };
// };

export default {
    validateBasicSectorSpecificKPI,
    getBasicSectorKPIDTO,
};
