import SocialKPI from './model.js';
import { getSocialKPIDTO } from './dto.js';
import { sectionSScoreCard } from "../parameterConfig/service.js"


export async function createEmptySocialKPI() {
    try {
        const newKpi = new SocialKPI();
        await newKpi.save();
        return getSocialKPIDTO(newKpi);
    } catch (error) {
        throw error;
    }
}

export async function createSocialKPI(kpiData) {
    try {
        const newKPI = new SocialKPI(kpiData);
        await newKPI.save();

        return getSocialKPIDTO(newKPI);
    } catch (error) {
        throw new Error(`Error creating SocialKPI: ${error.message}`);
    }
}

export async function getSocialKPIById(id) {
    try {
        const kpi = await SocialKPI.findById(id);
        if (!kpi) {
            throw new Error('SocialKPI not found');
        }
        return getSocialKPIDTO(kpi);
    } catch (error) {
        throw new Error(`Error fetching SocialKPI: ${error.message}`);
    }
}

export async function updateSocialKPI(id, data, role, userId) {
    try {

        const kpi = await SocialKPI.findById(id);
        if (!kpi) {
            throw new Error('SocialKPI not found');
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
                    if (role === "member" && /^S\d+$/.test(key) && !isUserAssigned(obj[key])) {
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

        const countData = await sectionSNumberOfKPIField(kpi.toJSON());
        kpi.completedStatus = countData;
        await kpi.save();

        return getSocialKPIDTO(kpi);
    } catch (error) {
        throw new Error(`Error updating SocialKPI: ${error.message}`);
    }
}

export async function genrateSectionSReport(id) {

    const data = await SocialKPI.findById(id);
    const afterCalculation = await sectionSScoreCard(data.toJSON());
    const updateAfterCalculation = await SocialKPI.findByIdAndUpdate(id, afterCalculation, { new: true });
    return getSocialKPIDTO(updateAfterCalculation);
}

export const sectionSNumberOfKPIField = async (data) => {
    let done = 0;

    const { S1, S2, S3, S4, S5, S6, S7, S8 } = data;

    const { totalMen, totalWomen, totalNonBinary } = S1;
    const { foreignEmployees } = S2;
    const { directEmployees, indirectEmployees } = S3;
    const { averageTenure } = S4;
    const { trainingHours } = S5;
    const { nonDiscriminatoryPolicy } = S6;
    const { trir } = S7;
    const { campusHires } = S8;

    const kpiValues = [
        totalMen,
        totalWomen,
        totalNonBinary,
        foreignEmployees,
        directEmployees,
        indirectEmployees,
        averageTenure,
        trainingHours,
        nonDiscriminatoryPolicy,
        trir,
        campusHires
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
        done: done // Adjust done count since some sections have multiple fields
    };
}

export const addSectionSApprovalComponent = async (id, data) => {
    try {
        const kpi = await SocialKPI.findById(id);
        if (!kpi) {
            throw new Error('SocialKPI not found');
        }
        const { senderForVerification } = data;


        const elements = [
            kpi.S1, kpi.S2, kpi.S3, kpi.S4, kpi.S5, kpi.S6, kpi.S7, kpi.S8
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

        return getSocialKPIDTO(kpi);
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

export const updateSocialKPIApprovalStatus = async (id, code, status, message, userId) => {
    try {
        const kpi = await SocialKPI.findById(id);
        if (!kpi) {
            throw new Error('SocialKPI not found');
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

        return getSocialKPIDTO(kpi);
    } catch (error) {
        throw new Error(`Error updating approval status: ${error.message}`);
    }
}

export const addAssignUsersInSocialKPI = async (id, code, assignUsers) => {
    try {
        const kpi = await SocialKPI.findById(id);
        if (!kpi) {
            throw new Error('SocialKPI not found');
        }

        const element = kpi[code];
        if (!element) {
            throw new Error(`Element ${code} not found in SocialKPI`);
        }

        if (!element.assign) {
            element.assign = {};
        }

        element.assign.assignMembers = assignUsers;

        // Mark the specific field as modified
        kpi.markModified(`${code}.assign.assignMembers`);

        // Save the updated KPI
        await kpi.save();

        return getSocialKPIDTO(kpi);
    } catch (error) {
        throw new Error(`Error assigning users to SocialKPI: ${error.message}`);
    }
}
