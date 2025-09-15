import {
    getOrganization as getOrganizationService,
    updateStatus as updateStatusService,
    getAllOrganization as getAllOrganizationsService,
    getOrganizationByIdWithAllDetails,
    getOrganizationCountByMonthYear as getOrganizationCountByMonthYearService
} from "./service.js";

export const getOrganization = async (req, res, next) => {
    try {

        const userId = req.user.userId;
        const response = await getOrganizationService({ userId });

        return res.status(200).json(response);

    } catch (error) {
        next(error);
    }
}

// New updateStatus function
export const updateStatus = async (req, res, next) => {
    try {
        const { orgId, status } = req.body;
        const validStatuses = ["active", "block"];
        if (!validStatuses.includes(status)) {
            throw new Error("Invalid status");
        }
        const updatedOrganization = await updateStatusService({ orgId, status });
        return res.status(200).json(updatedOrganization);
    } catch (error) {
        next(error);
    }
}

// New getAllOrganizations function
export const getAllOrganizations = async (req, res, next) => {
    try {
        const { status } = req.query;
        const validStatuses = ["active", "block"];
        if (status && !validStatuses.includes(status)) {
            throw new Error("Invalid status");
        }

        const organizations = await getAllOrganizationsService({ status });
        return res.status(200).json(organizations);
    } catch (error) {
        next(error);
    }
}

export const getOrganizationForAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const organizationDetails = await getOrganizationByIdWithAllDetails({ orgId: id });

        if (!organizationDetails) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        return res.status(200).json(organizationDetails);
    } catch (error) {
        console.error(`Error fetching organization details: ${error.message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getOrganizationCount = async (req, res, next) => {
    try {
        const { year, month, timezone } = req.query;

        // Validate input
        if (!year || !month) {
            return res.status(400).json({
                message: "Year and month are required query parameters."
            });
        }

        // Parse year and month to integers
        const parsedYear = parseInt(year, 10);
        const parsedMonth = parseInt(month, 10);

        // Validate year and month
        if (isNaN(parsedYear) || isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
            return res.status(400).json({
                message: "Invalid year or month provided."
            });
        }

        // Call the service function
        const result = await getOrganizationCountByMonthYearService(parsedYear, parsedMonth, timezone);

        res.status(200).json({
            message: "Organization count retrieved successfully.",
            count: result.count,
            year: parsedYear,
            month: parsedMonth,
            timezone: timezone || 'UTC'
        });

    } catch (error) {
        console.error('Error in getOrganizationCount:', error);
        next(error);
    }
};