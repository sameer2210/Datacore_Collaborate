import { validateAndSanitizeInitiateReportCreation, validateReportData, validateAssignKPIData } from './dto.js';
import {
    initiateReportCreation as initiateReportCreationService,
    updateReport as updateReportService,
    getReport as getReportService,
    genrateReport as genrateReportService,
    generateAIReport as generateAIReportService,
    getAllReports as getAllReportsService,
    updateReportStatus as updateReportStatusService,
    findActionableInsight as findActionableInsightService,
    getAllReportsForAdmin as getAllReportsForAdminService,
    updateReportApprovalStatus as updateReportApprovalStatusService,
    checkAndUpdateReportApprovalStatus as checkAndUpdateReportApprovalStatusService,
    getVettedReportCountByMonthYear as getVettedReportCountByMonthYearService,
    assignKPIsToUsers as assignKPIsToUsersService,
    deleteReport as deleteReportService,
    addSuppotingDocuments as addSuppotingDocumentsService,
    getSupportingDocument as getSupportingDocumentService,
} from "./service.js";
import mongoose from 'mongoose';
import { uploadFileToS3 } from '../../util/awsS3.js';
import multer from 'multer';
import Organization from '../organization/model.js';
import Country from '../country/model.js';
import Report from './model.js';

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'application/pdf',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv'
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, XLS, XLSX, and CSV files are allowed.'));
        }
    },
    limits: {
        fileSize: 25 * 1024 * 1024 // 25 MB in bytes
    },
});

export const initiateReportCreation = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId } = req.user;
        const data = validateAndSanitizeInitiateReportCreation(req.body);
        data.userId = userId;

        const response = await initiateReportCreationService(data, session);

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            message: "Report creation initiated successfully.",
            reportId: response.reportId
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        next(error);
    }
};

export const updateReport = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // const { userId } = req.user;
        const { id } = req.params;
        const { userId, role } = req.user;

        const data = validateReportData(req.body);

        const response = await updateReportService(id, data, role, userId, session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: "Report updated successfully.",
            report: response
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const getReport = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { role, userId } = req.user;

        let { last6YearsReports, actionableInsight } = req.query;

        if (last6YearsReports === undefined) {
            last6YearsReports = true;
        } else {
            last6YearsReports = last6YearsReports === "true";
        }

        if (actionableInsight == undefined)
            actionableInsight = true;
        else {
            actionableInsight = actionableInsight === "true"
        }


        const report = await getReportService(id, last6YearsReports, actionableInsight, role, userId);

        if (!report) {
            return res.status(404).json({
                message: "Report not found."
            });
        }


        const report_data = await Report.findById(id)

        let cleanElectricityFactor = 1
        const organizationId = report_data.organizationDetails?.organization;
        const organizationDetails = await Organization.findById(organizationId);
        const countryId = organizationDetails?.country;
        

        if (countryId) {
            const countryDetails = await Country.findById(countryId);
            if (countryDetails?.cleanElectricityFactor) {
                const factorForYear = countryDetails.cleanElectricityFactor.find(factor => factor.year === report_data.year);
                if (factorForYear) {
                    cleanElectricityFactor = factorForYear.value 
                }
            }
        }


        res.status(200).json({
            message: "Report retrieved successfully.",
            report: report,
            cleanElectricityFactor: cleanElectricityFactor
        });

    } catch (error) {
        next(error);
    }
};

export const genrateReport = async (req, res, next) => {
    try {
        const { id } = req.params;


        const report = await genrateReportService(id);

        if (!report) {
            return res.status(404).json({
                message: "Report not found."
            });
        }

        res.status(200).json({
            message: "Report generated successfully.",
            report: report
        });

    } catch (error) {
        next(error);
    }
};

export const genrateAIReport = async (req, res, next) => {
    try {
        upload.array('files', 15)(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: 'File upload error', error: err.message });
            } else if (err) {
                return res.status(500).json({ message: 'Server error', error: err.message });
            }

            const files = req.files;
            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded' });
            }

            const uploadPromises = files.map(file => uploadFileToS3(file, 'reports'));
            const uploadedFiles = await Promise.all(uploadPromises);
            const fileDetails = uploadedFiles.map((file, index) => { return file.key });

            const userId = req.users;
            const { id } = req.params;
            const { useOldFiles } = req.query;


            const reponse = await generateAIReportService(id, fileDetails, useOldFiles == "true" ? true : false);
            res.status(200).json(reponse);

        });
    } catch (error) {
        console.error('Error in file upload:', error);
        next(error);
    }
};

export const getAllReport = async (req, res, next) => {
    try {
        let { status } = req.query;

        const { organization, role, userId } = req.user;

        if (role == "super_admin") {
            const reports = await getAllReportsForAdminService(status);
            res.status(200).json({
                message: "Reports retrieved successfully.",
                reports: reports
            });
        }
        else {
            if (!organization)
                throw new Error('Organization ID is required'); // Specify the error
            const validStatuses = ['draft', 'ready', 'vetted', 'sendForVerification'];
            let filter = { organization: organization };
            if (status && validStatuses.includes(status)) {
                filter.status = status;
            }
            const reports = await getAllReportsService(filter, role, userId);
            res.status(200).json({
                message: "Reports retrieved successfully.",
                reports: reports
            });

        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const updateReportStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        let { status } = req.body;

        const newStatus = status;

        const validStatuses = ['draft', 'ready', 'vetted', 'sendForVerification'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error('Invalid status provided');
        }

        const updatedReport = await updateReportStatusService(id, newStatus);

        res.status(200).json(updatedReport);
    } catch (error) {
        next(error);
    }
};

export const getActionableInsight = async (req, res, next) => {
    try {
        const { id } = req.params;
        const report = await findActionableInsightService(id);

        res.status(200).json({
            message: "Report retrieved successfully.",
            report: report
        });

    } catch (error) {
        next(error);
    }
};

export const updateApprovalStaus = async (req, res, next) => {
    try {
        const { kpiName, code, status, message } = req.body;
        const { id } = req.params;
        const { userId } = req.user;

        // Validate input
        if (!id || !kpiName || !code) {
            return res.status(400).json({
                message: "Missing required fields: reportId, kpiName, code, and status are required."
            });
        }

        // Validate status
        const validStatuses = ['approved', 'rejected'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Status must be either 'approved' or 'rejected'."
            });
        }

        // Update the report with the new approval status
        await updateReportApprovalStatusService(id, kpiName, code, status, message, userId);

        res.status(200).json({
            message: "KPI approval status updated successfully.",
        });

    } catch (error) {
        console.error('Error in approvalStaus:', error);
        next(error);
    }
};

export const submitReportFromAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await checkAndUpdateReportApprovalStatusService(id);

        res.status(200).json({
            message: "Report status updated successfully.",
            result: result
        });

    } catch (error) {
        console.error('Error in submitReportFromAdmin:', error);
        next(error);
    }
}

export const getVettedReportCount = async (req, res, next) => {
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
        const result = await getVettedReportCountByMonthYearService(parsedYear, parsedMonth, timezone);

        res.status(200).json({
            message: "Vetted report count retrieved successfully.",
            count: result.count,
            year: parsedYear,
            month: parsedMonth,
            timezone: timezone || 'UTC'
        });

    } catch (error) {
        console.error('Error in getVettedReportCount:', error);
        next(error);
    }
};

export const assignKPIs = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userId, organization } = req.user;

        // Validate the input data
        const validatedData = validateAssignKPIData(req.body);

        const result = await assignKPIsToUsersService(id, validatedData, userId, organization);

        res.status(200).json({
            message: "KPIs assigned successfully.",
            result: result
        });

    } catch (error) {
        console.error('Error in assignKPIs:', error);
        next(error);
    }
};


export const deleteReportController = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const result = await deleteReportService(id);

        res.status(200).json({
            message: "Report deleted successfully.",
        });

    } catch (error) {
        console.error('Error in deleteReportController:', error);
        next(error);
    }
};

const uploadSuppotingDocuments = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'application/pdf',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv'
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, XLS, XLSX, and CSV files are allowed.'));
        }
    }
});

export const addSuppotingDocuments = (req, res, next) => {
    uploadSuppotingDocuments.array('files', 15)(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'File upload error', error: err.message });
        } else if (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }

        try {
            const files = req.files;
            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded' });
            }

            const uploadPromises = files.map(file => uploadFileToS3(file, 'reports'));
            const uploadedFiles = await Promise.all(uploadPromises);

            const userId = req.user; // Assuming req.user contains the user ID
            const { id } = req.params;

            const response = await addSuppotingDocumentsService(id, uploadedFiles, userId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    });
};

export const getSupportingDocument = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        const { userId } = req.user;
        const {key} = req.query;
        const {id} = req.params;

        const result = await getSupportingDocumentService({key,reportId:id});

        // Default to application/octet-stream if content type is not available
        const contentType = result.data.ContentType || 'application/octet-stream';
        
        // Set appropriate headers for file download
        res.setHeader('Content-Type', contentType);
        if (result.data.ContentLength) {
            res.setHeader('Content-Length', result.data.ContentLength);
        }
        res.setHeader('Content-Disposition', `attachment; filename="${result.data.name}"`);

        // Send the file data as response
        res.send(result.data.Body);

    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        next(error);
    }
    finally {
        session.endSession();
    }
};