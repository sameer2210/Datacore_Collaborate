import EnvironmentKPI from './model.js';
import { getEnvironmentKPIDTO } from './dto.js';
import { sectionEScoreCard } from "../parameterConfig/service.js";

export async function createEmptyEnvironmentKPI() {
    try {
        const newKpi = new EnvironmentKPI();
        await newKpi.save();
        return getEnvironmentKPIDTO(newKpi);
    } catch (error) {
        throw error;
    }
}

export async function createEnvironmentKPI(kpiData) {
    try {
        const newKPI = new EnvironmentKPI(kpiData);
        await newKPI.save();
        return getEnvironmentKPIDTO(newKPI);
    } catch (error) {
        throw new Error(`Error creating EnvironmentKPI: ${error.message}`);
    }
}

export async function getEnvironmentKPIById(id) {
    try {
        const kpi = await EnvironmentKPI.findById(id);
        if (!kpi) {
            throw new Error('EnvironmentKPI not found');
        }
        return getEnvironmentKPIDTO(kpi);
    } catch (error) {
        throw new Error(`Error fetching EnvironmentKPI: ${error.message}`);
    }
}

export async function updateEnvironmentKPI(id, data, role, userId) {
    try {
        const kpi = await EnvironmentKPI.findById(id);
        if (!kpi) {
            throw new Error('EnvironmentKPI not found');
        }

        const isUserAssigned = (field) => {
            const result = field.assign &&
                field.assign.assignMembers &&
                field.assign.assignMembers.some(member => member.toString() == userId);
            return result === undefined ? false : result;
        };

        // Helper function to update nested fields
        const updateNestedFields = async (obj, updates) => {
            for (const [key, value] of Object.entries(updates)) {
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    if (!obj[key]) obj[key] = {};

                    if (role === "member" && /^E\d+$/.test(key) && !isUserAssigned(obj[key])) {
                        throw new Error("Members can only edit fields they are assigned to");
                    }
                    await updateNestedFields(obj[key], value);
                } else {
                    // Check if the field is approved before updating
                    const field = obj[key];
                    if (field && field.approvalSchema) {
                        const isApproved = await checkElementIsApproved(field);
                        if (isApproved) {
                            continue;
                        }
                    }
                    if(value === null) {
                        obj[key]=undefined
                        continue;
                    }
                    obj[key] = value;
                }
            }
        };

        // Update the KPI data
        await updateNestedFields(kpi, data);

        // Save the updated KPI
        await kpi.save();

        const countData = await sectionENumberOfKPIField(kpi.toJSON());
        kpi.completedStatus = countData;
        await kpi.save();

        return getEnvironmentKPIDTO(kpi);
    } catch (error) {
        throw new Error(`Error updating EnvironmentKPI: ${error.message}`);
    }
}

export async function genrateSectionEReport(id,totalHazardousWaste,totalNonHazardousWaste) {
    const data = await EnvironmentKPI.findById(id);
    const afterCalculation = await sectionEScoreCard(data.toJSON(),totalHazardousWaste,totalNonHazardousWaste);
    const updateAfterCalculation = await EnvironmentKPI.findByIdAndUpdate(id, afterCalculation, { new: true });
    return getEnvironmentKPIDTO(updateAfterCalculation);
}

export const sectionENumberOfKPIField = async (data) => {
    let done = 0;

    const { E1: E1Data, E2: E2Data, E3: E3Data, E4: E4Data, E5: E5Data,
        E6: E6Data, E7: E7Data, E8: E8Data, E9: E9Data } = data;

    const { scope1Emissions, scope2Emissions } = E1Data;
    const { scope3Emissions } = E2Data;
    const { waterConsumed } = E3Data;
    const { wasteToLandfill } = E4Data;
    const { noxReleased } = E5Data;
    const { soxReleased } = E6Data;
    const { h2sConcentration } = E7Data;
    const { noiseLevel } = E8Data;
    const { wasteWaterTreated, totalWasteWater } = E9Data;

    const kpiValues = [
        scope1Emissions,
        scope2Emissions,
        scope3Emissions,
        waterConsumed,
        wasteToLandfill,
        noxReleased,
        soxReleased,
        h2sConcentration,
        noiseLevel,
        wasteWaterTreated,
        totalWasteWater
    ];

    kpiValues.forEach(element => {
        // if (element && element.value)
        //     done++;

        if (element && element.value !== undefined && element.value !== null) {
            done++;
        }
    });

    return {
        total: kpiValues.length,
        done: done,
    }
}

export const addSectionEApprovalComponent = async (id, data) => {
    try {
        const kpi = await EnvironmentKPI.findById(id);
        if (!kpi) {
            throw new Error('EnvironmentKPI not found');
        }
        const { senderForVerification } = data;

        const elements = [
            kpi.E1, kpi.E2, kpi.E3, kpi.E4, kpi.E5,
            kpi.E6, kpi.E7, kpi.E8, kpi.E9
        ];

        let updatedElements = false;

        for (let element of elements) {
            if (element && !(await checkElementIsApproved(element))) {
                if (!element.approvalSchema) {
                    element.approvalSchema = [];
                }
                element.approvalSchema.push({
                    status: 'pending',
                    senderForVerification,
                    createdAt: new Date()
                });
                updatedElements = true;
            }
        }

        if (updatedElements) {
            await kpi.save();
        }

        return getEnvironmentKPIDTO(kpi);
    } catch (error) {
        throw new Error(`Error adding approval component: ${error.message}`);
    }
}

const checkElementIsApproved = async (element) => {
    try {
        if (element.approvalSchema && element.approvalSchema.length > 0) {
            element.approvalSchema.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return element.approvalSchema[0].status === "approved";
        }
        return false; // Return false if there's no approval schema or it's empty
    } catch (error) {
        throw error;
    }
};

export const updateEnvironmentKPIApprovalStatus = async (id, code, status, message, userId) => {
    try {
        const kpi = await EnvironmentKPI.findById(id);
        if (!kpi) {
            throw new Error('EnvironmentKPI not found');
        }

        const element = kpi[code];
        if (!element || !element.approvalSchema || element.approvalSchema.length === 0) {
            throw new Error(`Element ${code} not found or doesn't have an approval schema`);
        }

        // Update the status of the last approval entry
        const lastApprovalIndex = element.approvalSchema.length - 1;
        const oldStatus = element.approvalSchema[lastApprovalIndex].status;

        if (oldStatus === "approved") {
            throw new Error("This is already approved");
        }

        const validStatuses = ["approved", "rejected", "pending"];
        if (status && !validStatuses.includes(status)) {
            throw new Error("Invalid status provided");
        }

        if (status && status !== oldStatus) {
            element.approvalSchema[lastApprovalIndex].status = status;
            element.approvalSchema[lastApprovalIndex].updatedAt = new Date();
        }

        if (message) {
            element.approvalSchema[lastApprovalIndex].message = message;
        }

        element.approvalSchema[lastApprovalIndex].approvedBy = userId;


        // Mark the specific field as modified
        kpi.markModified(code);

        // Save the updated KPI
        await kpi.save();

        return getEnvironmentKPIDTO(kpi);
    } catch (error) {
        throw new Error(`Error updating approval status: ${error.message}`);
    }
}

export const addAssignUsersInEnvironmentKPI = async (id, code, assignUsers) => {
    try {
        const kpi = await EnvironmentKPI.findById(id);
        if (!kpi) {
            throw new Error('EnvironmentKPI not found');
        }

        const element = kpi[code];
        if (!element) {
            throw new Error(`Element ${code} not found in EnvironmentKPI`);
        }

        if (!element.assign) {
            element.assign = {};
        }

        element.assign.assignMembers = assignUsers;

        // Mark the specific field as modified
        kpi.markModified(`${code}.assign.assignMembers`);

        // Save the updated KPI
        await kpi.save();

        return getEnvironmentKPIDTO(kpi);
    } catch (error) {
        throw new Error(`Error assigning users to EnvironmentKPI: ${error.message}`);
    }
}

