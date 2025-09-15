import BasicSectorSpecificKPI from './model.js';
import {
    getBasicSectorKPIDTO,
} from './dto.js';
import { sectionBScoreCard } from "../parameterConfig/service.js"
import { approvalSchema } from "../report/model.js";
import { Error } from 'mongoose';



export async function createEmptyBasicSectorSpecificKPI() {
    try {
        const newKpi = new BasicSectorSpecificKPI();
        await newKpi.save();
        return getBasicSectorKPIDTO(newKpi);

    } catch (error) {
        throw error;
    }
}
export async function createBasicSectorSpecificKPI(kpiData) {
    try {
        const newKPI = new BasicSectorSpecificKPI(kpiData);
        await newKPI.save();
        return getBasicSectorKPIDTO(newKPI);
    } catch (error) {
        throw new Error(`Error creating BasicSectorSpecificKPI: ${error.message}`);
    }
}
export async function getBasicSectorSpecificKPIById(id) {
    try {
        const kpi = await BasicSectorSpecificKPI.findById(id);
        if (!kpi) {
            throw new Error('BasicSectorSpecificKPI not found');
        }
        return getBasicSectorKPIDTO(kpi);
    } catch (error) {
        throw new Error(`Error fetching BasicSectorSpecificKPI: ${error.message}`);
    }
}
export async function updatedBasicSectorSpecificKPI(id, data, role, userId) {
    try {
        const kpi = await BasicSectorSpecificKPI.findById(id);
        if (!kpi) {
            throw new Error('BasicSectorSpecificKPI not found');
        }

        // Helper function to check if user is assigned to a field
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

                    if (role === "member" && /^B\d+$/.test(key) && !isUserAssigned(obj[key])) {
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

        const countData = await sectionBNumberOfKPIField(kpi.toJSON());
        kpi.completedStatus = countData;
        await kpi.save();

        return getBasicSectorKPIDTO(kpi);
    } catch (error) {
        throw new Error(`Error updating BasicSectorSpecificKPI: ${error.message}`);
    }
}
export async function genrateSectionBReport(id,Country,year) {

    const data = await BasicSectorSpecificKPI.findById(id);
    const afterCalculation = await sectionBScoreCard(data.toJSON(),Country,year);
    const updateAfterCalculation = await BasicSectorSpecificKPI.findByIdAndUpdate(id, afterCalculation, { new: true });
    return getBasicSectorKPIDTO(updateAfterCalculation);
}
export const sectionBNumberOfKPIField = async (data) => {
    let done = 0;

    const { B1: B1Data, B2: B2Data, B3: B3Data, B4: B4Data, B5: B5Data, B6: B6Data } = data;

    const { scope1Emissions, scope2Emissions, grossRevenue } = B1Data;
    const { totalWaterConsumption } = B2Data;
    const { totalHazardousWaste } = B3Data;
    const { totalNonHazardousWaste } = B4Data;
    const { Y1, Y2, Y3 } = B5Data;
    const { totalElectricityConsumption, electricityFromGrid, recPurchased, electricityFromRenewables } = B6Data;

    const kpiValues = [
        scope1Emissions,
        scope2Emissions,
        grossRevenue,
        totalWaterConsumption,
        totalHazardousWaste,
        totalNonHazardousWaste,
        Y1,
        Y2,
        Y3,
        totalElectricityConsumption,
        electricityFromGrid,
        recPurchased,
        electricityFromRenewables
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
        done: done // Adjust done count since multiple fields make up one complete section
    };
}
export const addSectionBApprovalComponent = async (id, data) => {
    try {
        const kpi = await BasicSectorSpecificKPI.findById(id);
        if (!kpi) {
            throw new Error('BasicSectorSpecificKPI not found');
        }
        const { senderForVerification } = data;


        const elements = [
            kpi.B1, kpi.B2, kpi.B3, kpi.B4, kpi.B5, kpi.B6
        ];

        let updatedElements = false;

        for (let element of elements) {
            if (element && typeof element === 'object' && !(await checkElementIsApproved(element))) {
                if (!element.approvalSchema) {
                    element.approvalSchema = [];
                }
                element.approvalSchema.push({
                    senderForVerification,
                });

                updatedElements = true;

                // Mark the parent KPI as modified
                kpi.markModified(`B${elements.indexOf(element) + 1}`); // Adjust index based on your structure
            }
        }

        // Save the updated KPI after modifying elements
        if (updatedElements) {
            await kpi.save(); // Ensure the kpi is saved after updates
        }


        return getBasicSectorKPIDTO(kpi);
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

export const updateBasicSectorSpecificKPIApprovalStatus = async (id, code, status, message, userId) => {
    try {
        const kpi = await BasicSectorSpecificKPI.findById(id);
        if (!kpi) {
            throw new Error('BasicSectorSpecificKPI not found');
        }

        const element = kpi[code];
        if (!element || !element.approvalSchema || element.approvalSchema.length === 0) {
            throw new Error(`Element ${code} not found or doesn't have an approval schema`);
        }

        // Update the status of the last approval entry
        const lastApprovalIndex = element.approvalSchema.length - 1;
        const oldStatus = element.approvalSchema[lastApprovalIndex].status;

        if (oldStatus == "approved") {
            throw new Error("This is already approved");
        }

        if (status)
            element.approvalSchema[lastApprovalIndex].status = status;

        if (message && element.approvalSchema[lastApprovalIndex].status == "rejected") {
            element.approvalSchema[lastApprovalIndex].message = message;
        }

        element.approvalSchema[lastApprovalIndex].approvedBy = userId;

        // Mark the specific field as modified
        kpi.markModified(code);

        // Save the updated KPI
        await kpi.save();

        return getBasicSectorKPIDTO(kpi);
    } catch (error) {
        throw new Error(`Error updating approval status: ${error.message}`);
    }
}

// ... rest of the existing code ...

export const addAssignUsersInBasicSectorKPI = async (id, code, assignUsers) => {
    try {
        const kpi = await BasicSectorSpecificKPI.findById(id);
        if (!kpi) {
            throw new Error('BasicKPI not found');
        }

        const element = kpi[code];
        if (!element) {
            throw new Error(`Element ${code} not found in BasicKPI`);
        }

        if (!element.assign) {
            element.assign = {};
        }

        element.assign.assignMembers = assignUsers;

        // Mark the specific field as modified
        kpi.markModified(`${code}.assign.assignMembers`);

        // Save the updated KPI
        await kpi.save();

        return getBasicSectorKPIDTO(kpi);
    } catch (error) {
        throw new Error(`Error assigning users to BasicKPI: ${error.message}`);
    }
}

// ... rest of the existing code ...
