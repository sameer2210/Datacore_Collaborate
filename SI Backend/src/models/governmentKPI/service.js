import GovernmentKPI from './model.js';
import { getGovernmentKPIDTO } from './dto.js';
import { sectionGScoreCard } from "../parameterConfig/service.js";

export async function createEmptyGovernmentKPI() {
    try {
        const newKpi = new GovernmentKPI();
        await newKpi.save();
        return getGovernmentKPIDTO(newKpi);
    } catch (error) {
        throw error;
    }
}

export async function createGovernmentKPI(kpiData) {
    try {
        const newKPI = new GovernmentKPI(kpiData);
        await newKPI.save();
        return getGovernmentKPIDTO(newKPI);
    } catch (error) {
        throw new Error(`Error creating GovernmentKPI: ${error.message}`);
    }
}

export async function getGovernmentKPIById(id) {
    try {
        const kpi = await GovernmentKPI.findById(id);
        if (!kpi) {
            throw new Error('GovernmentKPI not found');
        }
        return getGovernmentKPIDTO(kpi);
    } catch (error) {
        throw new Error(`Error fetching GovernmentKPI: ${error.message}`);
    }
}

export async function updateGovernmentKPI(id, data, grossRevenue, role, userId) {
    try {
        const kpi = await GovernmentKPI.findById(id);
        if (!kpi) {
            throw new Error('GovernmentKPI not found');
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

                    if (role === "member" && /^G\d+$/.test(key) && !isUserAssigned(obj[key])) {
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
        if (data) {
            await updateNestedFields(kpi, data);
        }

        // Save the updated KPI
        await kpi.save();

        const countData = await sectionGNumberOfKPIField(kpi.toJSON(), grossRevenue);
        kpi.completedStatus = countData;
        await kpi.save();

        return getGovernmentKPIDTO(kpi);
    } catch (error) {
        throw new Error(`Error updating GovernmentKPI: ${error.message}`);
    }
}

export async function genrateSectionGReport(id, grossRevenue) {

    const data = await GovernmentKPI.findById(id);
    const afterCalculation = await sectionGScoreCard(data.toJSON(), grossRevenue);
    const updateAfterCalculation = await GovernmentKPI.findByIdAndUpdate(id, afterCalculation, { new: true });
    return getGovernmentKPIDTO(updateAfterCalculation);
}

export const sectionGNumberOfKPIField = async (data, grossRevenue) => {
    let done = 0;

    const { G1: G1Data, G2: G2Data, G3: G3Data, G4: G4Data, G5: G5Data,
        G6: G6Data, G7: G7Data, G8: G8Data, G9: G9Data, G10: G10Data } = data;

    const { taxReliefReceived } = G1Data;
    const { pensionContribution } = G2Data;
    const { localSuppliersSpending } = G3Data;
    const { newSuppliersSpending } = G4Data;
    const { localCommunitiesSpending } = G5Data;
    const { innovativeTechnologiesSpending } = G6Data;
    const { ethicsPolicyInPlace } = G7Data;
    const { totalComplaints, resolvedComplaints } = G8Data;
    const { boardMembers } = G9Data;
    const { csrSpending } = G10Data;

    const kpiValues = [
        taxReliefReceived,
        pensionContribution,
        localSuppliersSpending,
        newSuppliersSpending,
        localCommunitiesSpending,
        innovativeTechnologiesSpending,
        ethicsPolicyInPlace,
        totalComplaints,
        resolvedComplaints,
        boardMembers,
        csrSpending
    ];

    kpiValues.forEach(element => {
        // if (element && element.value)
        //     done++;

        if (element && element.value !== undefined && element.value !== null) {
            done++;
        }
    })

    return {
        total: kpiValues.length,
        done: done,
    }
}

export const addSectionGApprovalComponent = async (id, data) => {
    try {
        const kpi = await GovernmentKPI.findById(id);
        if (!kpi) {
            throw new Error('GovernmentKPI not found');
        }
        const { senderForVerification } = data;

        const elements = [
            kpi.G1, kpi.G2, kpi.G3, kpi.G4, kpi.G5,
            kpi.G6, kpi.G7, kpi.G8, kpi.G9, kpi.G10
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

        return getGovernmentKPIDTO(kpi);
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

export const updateGovernmentKPIApprovalStatus = async (id, code, status, message, userId) => {
    try {
        const kpi = await GovernmentKPI.findById(id);
        if (!kpi) {
            throw new Error('GovernmentKPI not found');
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

        return getGovernmentKPIDTO(kpi);
    } catch (error) {
        throw new Error(`Error updating approval status: ${error.message}`);
    }
}

export const addAssignUsersInGovernmentKPI = async (id, code, assignUsers) => {
    try {
        const kpi = await GovernmentKPI.findById(id);
        if (!kpi) {
            throw new Error('GovernmentKPI not found');
        }

        const element = kpi[code];
        if (!element) {
            throw new Error(`Element ${code} not found in GovernmentKPI`);
        }

        if (!element.assign) {
            element.assign = {};
        }

        element.assign.assignMembers = assignUsers;

        // Mark the specific field as modified
        kpi.markModified(`${code}.assign.assignMembers`);

        // Save the updated KPI
        await kpi.save();

        return getGovernmentKPIDTO(kpi);
    } catch (error) {
        throw new Error(`Error assigning users to GovernmentKPI: ${error.message}`);
    }
}
