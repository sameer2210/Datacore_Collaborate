import { getBasicSectorKPIDTO, validateBasicSectorSpecificKPI } from "../basicSectorSpecificKPI/dto.js";
import { getEnvironmentKPIDTO, validateEnvironmentKPI } from "../environmentKPI/dto.js";
import { getSocialKPIDTO, validateSocialKPI } from '../socialKPI/dto.js';
import { getGovernmentKPIDTO, validateGovernmentKPI } from '../governmentKPI/dto.js';
import { responseOrganizationDTO } from "../organization/dto.js";
import { Types } from 'mongoose';

export const validateAndSanitizeInitiateReportCreation = (data) => {
    const {
        name,
        year,
        period,
        segment,
        organization_id,
        license,
        total_site_area,
        units_produced_value,
        units_produced_unit,
        raw_material_consumption_value,
        raw_material_consumption_unit,
        organizationName
    } = data;

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new Error('Invalid report name');
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (!year || !Number.isInteger(year) || year < 1900 || year > currentYear) {
        throw new Error('Invalid year');
    }

    // Validate segment
    if (!segment || typeof segment !== 'string' || segment.trim().length === 0) {
        throw new Error('Invalid segment');
    }

    // Validate organization_id
    if (!organization_id || typeof organization_id !== 'string') {
        throw new Error('Invalid organization ID');
    }

    // Validate license (optional)
    if (license !== undefined && (typeof license !== 'string' || license.trim().length === 0)) {
        throw new Error('Invalid license');
    }

    // Validate total_site_area
    if (!total_site_area || typeof total_site_area !== 'number' || total_site_area <= 0) {
        throw new Error('Invalid total site area');
    }

    // Validate units_produced
    if (!units_produced_value || typeof units_produced_value !== 'number' || units_produced_value < 0) {
        throw new Error('Invalid units produced value');
    }
    if (!units_produced_unit || typeof units_produced_unit !== 'string' || units_produced_unit.trim().length === 0) {
        throw new Error('Invalid units produced unit');
    }

    // Validate raw_material_consumption (optional)
    if (raw_material_consumption_value !== undefined) {
        if (typeof raw_material_consumption_value !== 'number' || raw_material_consumption_value < 0) {
            throw new Error('Invalid raw material consumption value');
        }
        if (!raw_material_consumption_unit || typeof raw_material_consumption_unit !== 'string' || raw_material_consumption_unit.trim().length === 0) {
            throw new Error('Invalid raw material consumption unit');
        }
    }

    return {
        name: name.trim(),
        year,
        period,
        segment: segment.trim(),
        organizationDetails: {
            organization: organization_id,
            name: organizationName,
            license: license?.trim(),
            totalSiteArea: total_site_area,
            unitsProduced: {
                value: units_produced_value,
                unit: units_produced_unit.trim()
            },
            rawMaterialConsumption: raw_material_consumption_value && {
                value: raw_material_consumption_value,
                unit: raw_material_consumption_unit.trim()
            }
        },
    };
}

export const validateReportData = (data) => {
    try {
        const { basicSectorSpecificKPI, governanceKPI, environmentKPI, socialKPI } = data;
        const responseData = {};

        if (basicSectorSpecificKPI) {
            const value = validateBasicSectorSpecificKPI(basicSectorSpecificKPI);
            responseData.basicSectorSpecificKPI = value;
        }
        if (governanceKPI) {
            const value = validateGovernmentKPI(governanceKPI);
            responseData.governanceKPI = value;
        }
        if (environmentKPI) {
            const value = validateEnvironmentKPI(environmentKPI);
            responseData.environmentKPI = value;
        }
        if (socialKPI) {
            const value = validateSocialKPI(socialKPI);
            responseData.socialKPI = value;
        }

        return responseData;
    } catch (error) {
        throw error;
    }
}

export const getReportDTO = (data, withLastApprovalStatus, role, userId) => {
    const isMongoId = (value) => Types.ObjectId.isValid(value);
    const isRestrictedUser = role && role !== "admin" && role !== "super_admin";



    if (withLastApprovalStatus == undefined) {
        withLastApprovalStatus = false;
    }

    const sendForApprovalLastId = data?.sendForApproval.length > 0 ? data?.sendForApproval[data?.sendForApproval.length - 1]._id : null;
    if (sendForApprovalLastId == null) {
        withLastApprovalStatus = false;
    }

    return {
        // Basic details
        id: data._id,
        name: data.name,
        year: data.year,
        period: data.period,
        segment: data.segment,
        reportNo: data?.reportNo,
        status: data.status,
        assignUsers: data.assignUsers,
        unReadMessage: data.unReadMessage,
        ...(isRestrictedUser ? {} : {
            score: data?.score,
            grade: data?.grade,
            actionableInsights: data?.actionableInsights,
            completedStatus: data?.completedStatus,
            sendForApproval: data?.sendForApproval,
            sendForVerificationDate: data?.sendForVerificationDate,
            sendForApproval: data?.sendForApproval,
            last6YearsReports: data?.last6YearsReports,
        }),
        organizationDetails: {
            organization: typeof data.organizationDetails.organization === 'object' ? responseOrganizationDTO(data.organizationDetails.organization) : data.organizationDetails.organization,
            license: data.organizationDetails.license,
            totalSiteArea: data.organizationDetails.totalSiteArea,
            unitsProduced: data.organizationDetails.unitsProduced,
            rawMaterialConsumption: data.organizationDetails.rawMaterialConsumption
        },

        // KPI data
        environmentKPI: !isMongoId(data.environmentKPI) && typeof data.environmentKPI === 'object'
            ? getEnvironmentKPIDTO(data.environmentKPI, withLastApprovalStatus, sendForApprovalLastId, role, userId)
            : data.environmentKPI,
        basicSectorSpecificKPI: !isMongoId(data.basicSectorSpecificKPI) && typeof data.basicSectorSpecificKPI === 'object'
            ? getBasicSectorKPIDTO(data.basicSectorSpecificKPI, withLastApprovalStatus, sendForApprovalLastId, role, userId)
            : data.basicSectorSpecificKPI,
        socialKPI: !isMongoId(data.socialKPI) && typeof data.socialKPI === 'object'
            ? getSocialKPIDTO(data.socialKPI, withLastApprovalStatus, sendForApprovalLastId, role, userId)
            : data.socialKPI,
        governanceKPI: !isMongoId(data.governanceKPI) && typeof data.governanceKPI === 'object'
            ? getGovernmentKPIDTO(data.governanceKPI, withLastApprovalStatus, sendForApprovalLastId, role, userId)
            : data.governanceKPI,
        supportingDocuments: data.supportingDocuments,
        // Add timestamps
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    };
};

export const getActionableInsightDTO = (data) => {
    return {
        code: data.code,
        name: data.name,
        actionableInsights: data.actionableInsights
    }
}

export const validateAssignKPIData = (data) => {
    const { kpiName, code, assign } = data;

    if (!kpiName || typeof kpiName !== 'string') {
        throw new Error('Invalid or missing kpiName');
    }

    if (!['basicSectorSpecificKPI', 'environmentKPI', 'socialKPI', 'governanceKPI'].includes(kpiName)) {
        throw new Error('Invalid kpiName');
    }

    if (!code || typeof code !== 'string') {
        throw new Error('Invalid or missing code');
    }

    if (!assign || !Array.isArray(assign)) {
        throw new Error('Invalid or missing assign array');
    }

    assign.forEach(assignment => {
        if (!assignment.userId || !Types.ObjectId.isValid(assignment.userId)) {
            throw new Error('Invalid userId in assign array');
        }
    });

    return { kpiName, code, assign: assign.map(({ userId }) => userId) };
};


export const getKPIData = (kpiData, withLastApprovalStatus, sendForApprovalLastId, role, isRestrictedUser) => {
    let kpiObject = isRestrictedUser ? {
        unReadMessage: kpiData?.unReadMessage,
        assign: kpiData?.assign,
        approval: withLastApprovalStatus && getApprovalDTO(kpiData, sendForApprovalLastId, role)

    } : {
        unReadMessage: kpiData?.unReadMessage,
        assign: kpiData?.assign,
        score: kpiData?.score,
        approval: withLastApprovalStatus && getApprovalDTO(kpiData, sendForApprovalLastId, role)
    };

    const keysNot = ["approval", "assign", "score"];

    // Dynamically add all value-unit-formula fields
    Object.keys(kpiData).forEach(key => {
        if (!keysNot.includes(key) && typeof kpiData[key] === 'object' && kpiData[key] !== null) {
            kpiObject[key] = getValueUnitFormulaDTO(kpiData[key]);
        }
    });

    return kpiObject;
};


const getApprovalDTO = (data, sendForApprovalLastId, role) => {
    const lastApproval = data.approvalSchema[data.approvalSchema.length - 1];
    return {
        ...lastApproval,
        ...(role === "super_admin" ? { resubmit: sendForApprovalLastId?.toString() == lastApproval.senderForVerification?.toString() } : {})
    };
};

const getValueUnitFormulaDTO = (data) => {
    return {
        value: data?.value,
        unit: data?.unit,
        formula: data?.formula,
    };
};