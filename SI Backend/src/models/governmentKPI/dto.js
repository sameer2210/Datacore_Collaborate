import Joi from 'joi';
import { getKPIData } from "../report/dto.js";


const valueSchema = Joi.alternatives().try(Joi.number(), Joi.boolean()).allow(null);

export const validateGovernmentKPI = (data) => {
    const schema = Joi.object({
        G1: Joi.object({
            taxReliefReceived: Joi.object({
                value: Joi.boolean().allow(null).required()
            })
        }),
        G2: Joi.object({
            pensionContribution: Joi.object({
                value: Joi.number().allow(null).required()
            })
        }),
        G3: Joi.object({
            localSuppliersSpending: Joi.object({
                value: Joi.number().allow(null).required()
            })
        }),
        G4: Joi.object({
            newSuppliersSpending: Joi.object({
                value: Joi.number().allow(null).required()
            })
        }),
        G5: Joi.object({
            localCommunitiesSpending: Joi.object({
                value: Joi.number().allow(null).required()
            })
        }),
        G6: Joi.object({
            innovativeTechnologiesSpending: Joi.object({
                value: Joi.number().allow(null).required()
            })
        }),
        G7: Joi.object({
            ethicsPolicyInPlace: Joi.object({
                value: Joi.boolean().allow(null).required()
            })
        }),
        G8: Joi.object({
            totalComplaints: Joi.object({
                value: Joi.number().integer().allow(null).required()
            }),
            resolvedComplaints: Joi.object({
                value: Joi.number().integer().allow(null).required()
            })
        }),
        G9: Joi.object({
            boardMembers: Joi.object({
                value: Joi.number().integer().allow(null).required()
            })
        }),
        G10: Joi.object({
            csrSpending: Joi.object({
                value: Joi.number().allow(null).required()
            })
        })
    });

    const { value, error } = schema.validate(data, { abortEarly: false });
    if (error)
        throw error;

    return value;
};

export const getGovernmentKPIDTO = (data, withLastApprovalStatus, sendForApprovalLastId, role, userId) => {
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
    const kpis = Object.keys(data).filter(key => key.match(/^G\d+$/));
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
    validateGovernmentKPI,
    getGovernmentKPIDTO,
};