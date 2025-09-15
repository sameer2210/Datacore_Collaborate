import Organization from "./model.js";
import { validateCountry } from "../country/service.js";
import { validateSector } from "../sector/service.js";
import { validateEmployeeCount } from "../employeeCount/service.js";
import { validateIndustry } from "../industry/service.js"
import { organizationIdFromUserId, getUsersOnOrganization } from "../user/service.js"
import { validateannualRevenue } from "../annualRevenue/service.js"
import { getAllReports } from "../report/service.js";
import { responseOrganizationDTO } from "./dto.js";
import { getQuota } from "../substribtionPlan/service.js";
import moment from 'moment-timezone';

export async function createOrganization(organizationData) {
    try {
        const organization = new Organization(organizationData);
        const country = await validateCountry(organizationData.country);
        if (!country) {
            throw new Error("Country not found");
        }
        const sector = await validateSector(organizationData.sector);
        if (!sector) {
            throw new Error("Sector not found");
        }
        const employeeCount = await validateEmployeeCount(organizationData.employeeCount);
        if (!employeeCount) {
            throw new Error("Employee count not found");
        }

        const annualRevenue = await validateannualRevenue(organizationData.averageRevenue);
        if (!annualRevenue) {
            throw new Error("Annual revenue is required and must be a positive number");
        }

        const industry = await validateIndustry(organizationData.industry);
        if (!industry) {
            throw new Error("Industry not found");
        }

        await organization.save();
        return organization;

    } catch (error) {
        throw new Error(`Error creating organization: ${error.message}`);
    }
}

export async function validateOrganization(id) {
    try {
        const organization = await Organization.findById(id);
        if (!organization) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

export async function getOrganization({ userId }) {
    try {
        const { organizationId } = await organizationIdFromUserId({ userId });
        const organization = await Organization.findById(organizationId)
            .populate('industry')
            .populate('sector')
            .populate('employeeCount')
            .populate('country')
            .populate('averageRevenue');


        if (!organization) {
            throw new Error('Organization not found');
        }


        return responseOrganizationDTO(organization);
    } catch (error) {
        throw new Error(`Error fetching organization: ${error.message}`);
    }
}

export async function getAllOrganization({ status }) {
    try {
        const query = status ? { status } : {};
        const organizations = await Organization.find(query)
            .populate('industry')
            .populate('sector')
            .populate('employeeCount')
            .populate('country')
            .populate('averageRevenue');

        if (!organizations || organizations.length === 0) {
            throw new Error('No organizations found');
        }

        const organizationsWithAdmins = await Promise.all(organizations.map(async (org) => {
            try {
                const adminUser = await getUsersOnOrganization({ organization: org._id, role: "admin" });
                const result = responseOrganizationDTO(org);

                return { ...result, admins: adminUser };

            } catch (error) {
                console.log(error);
                return null;
            }
        }));

        return organizationsWithAdmins;
    } catch (error) {
        console.log(error);
        throw new Error(`Error fetching organizations: ${error.message}`);
    }
}

export async function updateStatus({ orgId, status }) {
    try {
        // Validate the status
        const validStatuses = ["active", "block"];
        if (!validStatuses.includes(status)) {
            throw new Error("Invalid status");
        }



        // Find the organization by ID
        const organization = await Organization.findById(orgId);
        if (!organization) {
            throw new Error("Organization not found");
        }
        // Update the status
        organization.status = status;
        // Save the updated organization
        await organization.save();

        return { message: "Status Updated Successfully" };
    } catch (error) {
        throw new Error(`Error updating organization status: ${error.message}`);
    }
}

export async function getOrganizationById({ orgId }) {
    try {

        const organization = await Organization.findById(orgId);
        return responseOrganizationDTO(organization);

    } catch (error) {
        throw error;
    }
}

export async function updateOrganization(organizationId, updateData) {
    try {
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            throw new Error("Organization not found");
        }

        if (updateData.name) organization.name = updateData.name;
        if (updateData.logo) organization.logo = updateData.logo;
        if (updateData.address) organization.address = updateData.address
        if (updateData.employeeCount) {
            const employeeCount = await validateEmployeeCount(updateData.employeeCount);
            if (!employeeCount) throw new Error("Invalid employee count");
            organization.employeeCount = updateData.employeeCount;
        }
        if (updateData.country) {
            const country = await validateCountry(updateData.country);
            if (!country) throw new Error("Invalid country");
            organization.country = updateData.country;
        }
        if (updateData.averageRevenue) {
            const annualRevenue = await validateannualRevenue(updateData.averageRevenue);
            if (!annualRevenue) throw new Error("Invalid average revenue");
            organization.averageRevenue = updateData.averageRevenue;
        }
        if (updateData.sector) {
            const sector = await validateSector(updateData.sector);
            if (!sector) throw new Error("Invalid sector");
            organization.sector = updateData.sector;
        }
        if (updateData.industry) {
            const industry = await validateIndustry(updateData.industry);
            if (!industry) throw new Error("Invalid industry");
            organization.industry = updateData.industry;
        }
        if (updateData.registrationNumber) {
            organization.registrationNumber = updateData.registrationNumber;
        }

        await organization.save();
        return organization;
    } catch (error) {
        throw new Error(`Error updating organization: ${error.message}`);
    }
}

export async function getOrganizationByIdWithAllDetails({ orgId }) {
    try {
        const organization = await Organization.findById(orgId)
            .populate('industry')
            .populate('sector')
            .populate('employeeCount')
            .populate('country')
            .populate('averageRevenue');

        if (!organization) {
            throw new Error('Organization not found');
        }

        const organizationResponse = responseOrganizationDTO(organization);
        const adminUser = await getUsersOnOrganization({ organization: organization._id });
        const reports = await getAllReports({ organization: organization._id, statusArray: ["vetted"] }, "admin");

        // const quota = await getQuota(adminUser[0].id);

        let quota = {};
        try {
            quota = await getQuota(adminUser[0]?.id);
        } catch (quotaError) {
            console.warn(`Quota fetch error: ${quotaError.message}`); 
        }

        return { ...organizationResponse, adminUser: adminUser, reports: reports, quota: quota };

    } catch (error) {
        throw new Error(`Error fetching organization details: ${error.message}`);
    }
}

export async function getOrganizationCountByMonthYear(year, month, timezone = 'UTC') {
    try {
        // Create start and end dates for the given month and year in the specified timezone
        const startDate = moment.tz({ year, month: month - 1, day: 1 }, timezone).startOf('month').toDate();
        const endDate = moment.tz({ year, month: month - 1, day: 1 }, timezone).endOf('month').toDate();

        // Query the database for organizations created within the date range
        const count = await Organization.countDocuments({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        });

        return { count };
    } catch (error) {
        throw new Error(`Error getting organization count: ${error.message}`);
    }
}




