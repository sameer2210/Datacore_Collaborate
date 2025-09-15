import Report, { ActionableInsight } from './model.js';
import { validateReportData, getReportDTO, getActionableInsightDTO } from './dto.js';
import { getBasicSectorSpecificKPIById as getBasicSectorSpecificKPIByIdService, createBasicSectorSpecificKPI as createEmptyBasicSectorSpecificKPIService, updatedBasicSectorSpecificKPI as updatedBasicSectorSpecificKPIService, genrateSectionBReport as genrateSectionBReportService, addSectionBApprovalComponent as addSectionBApprovalComponentService, updateBasicSectorSpecificKPIApprovalStatus as updateBasicSectorSpecificKPIApprovalStatusService, addAssignUsersInBasicSectorKPI as addAssignUsersInBasicSectorKPIService } from '../basicSectorSpecificKPI/service.js';
import { createEmptyEnvironmentKPI as createEmptyEnvironmentKPIService, updateEnvironmentKPI as updateEnvironmentKPIService, genrateSectionEReport as genrateSectionEReportService, addSectionEApprovalComponent as addSectionEApprovalComponentService, updateEnvironmentKPIApprovalStatus as updateEnvironmentKPIApprovalStatusService, addAssignUsersInEnvironmentKPI as addAssignUsersInEnvironmentKPIService } from "../environmentKPI/service.js";
import { createEmptySocialKPI as createEmptySocialKPIService, updateSocialKPI as updateSocialKPIService, genrateSectionSReport as genrateSectionSReportService, addSectionSApprovalComponent as addSectionSApprovalComponentService, updateSocialKPIApprovalStatus as updateSocialKPIApprovalStatusService, addAssignUsersInSocialKPI as addAssignUsersInSocialKPIService } from '../socialKPI/service.js';
import { createEmptyGovernmentKPI as createEmptyGovernmentKPIService, updateGovernmentKPI as updateGovernmentKPIService, genrateSectionGReport as genrateSectionGReportService, addSectionGApprovalComponent as addSectionGApprovalComponentService, updateGovernmentKPIApprovalStatus as updateGovernmentKPIApprovalStatusService, addAssignUsersInGovernmentKPI as addAssignUsersInGovernmentKPIService } from '../governmentKPI/service.js';
import { getGrade } from '../parameterConfig/service.js';
import { fetchDataPointsFromAI } from "../../util/lambdaAI.js";
import { getIO } from "../../socket/socketSetup.js";
import { getUsersOnOrganization } from '../user/service.js'; // Add this import
import moment from 'moment-timezone';
import BasicSectorSpecificKPI from '../basicSectorSpecificKPI/model.js';
import EnvironmentKPI from '../environmentKPI/model.js';
import SocialKPI from '../socialKPI/model.js';
import GovernmentKPI from '../governmentKPI/model.js';
import {updateOrganization} from "../organization/service.js"
import Unit from '../unit/model.js';
import {totalUnReadMessagesInReport,numberOfUnreadMessages} from "../chat/service.js";
import { getFileFromS3 } from '../../util/awsS3.js';


export async function initiateReportCreation(reportData) {
    try {
        const {userId, organizationDetails, year, period, segment } = reportData;

        if(organizationDetails.name )
        {
            await updateOrganization(organizationDetails.organization, {name: organizationDetails.name});
        }

        let uniqueNumber;
        do {
            uniqueNumber = Math.floor(100000 + Math.random() * 900000);
        } while (await Report.exists({ reportNo: `SI-${uniqueNumber}` }));
        reportData.reportNo = `SI-${uniqueNumber}`
        const report = new Report({ ...reportData });
        const basicSectorSpecificKPI = await createEmptyBasicSectorSpecificKPIService();
        report.basicSectorSpecificKPI = basicSectorSpecificKPI.id;
        const environmentKPI = await createEmptyEnvironmentKPIService();
        report.environmentKPI = environmentKPI.id;
        const socialKPI = await createEmptySocialKPIService();
        report.socialKPI = socialKPI.id;
        const governanceKPI = await createEmptyGovernmentKPIService();
        report.governanceKPI = governanceKPI.id;
        const last6YearsReports = await getLast6YearsReports(organizationDetails.organization, year, segment);
        report.last6YearsReports = last6YearsReports;
        await report.save()


        return { message: "Report creation initiated successfully.", reportId: report._id };
    } catch (error) {
        throw error;
    }
}

export async function updateReport(id, data, role, userId, session) {
    try {

        if (role == "viewer") {
            throw new Error("Viewers are not authorized to update reports");
        }


        let report = await Report.findById(id);
        let doneKPI = 0;

        if (!report) {
            throw new Error("Report not found");
        }

        if (data.basicSectorSpecificKPI) {
            const basicSectorSpecificKPIId = report.basicSectorSpecificKPI;
            const updatedBasicSectorSpecificKPI = await updatedBasicSectorSpecificKPIService(basicSectorSpecificKPIId, data.basicSectorSpecificKPI, role, userId);
        }

        if (data.environmentKPI) {
            const updatedEnvironmentKPI = await updateEnvironmentKPIService(report.environmentKPI, data.environmentKPI, role, userId);
        }

        if (data.socialKPI) {
            const updatedSocialKPI = await updateSocialKPIService(report.socialKPI, data.socialKPI, role, userId);
        }

        if (data.governanceKPI || data?.basicSectorSpecificKPI?.B1?.grossRevenue) {
            let grossRevenue = data?.basicSectorSpecificKPI?.B1?.grossRevenue


            if (!grossRevenue || grossRevenue.value == undefined) {
                let tempBasicSectorSpecificKPI = await getBasicSectorSpecificKPIByIdService(report.basicSectorSpecificKPI, role);
                grossRevenue = tempBasicSectorSpecificKPI.B1.grossRevenue;
            }


            const updatedGovernanceKPI = await updateGovernmentKPIService(report.governanceKPI, data.governanceKPI, grossRevenue, role, userId);
        }


        const updatedReport = await Report.findById(id)
            .populate({
                path: 'organizationDetails.organization',
            })
            .populate('organizationDetails.unitsProduced.unit')
            .populate('organizationDetails.rawMaterialConsumption.unit')
            .populate('socialKPI')
            .populate('environmentKPI')
            .populate('governanceKPI')
            .populate('basicSectorSpecificKPI');




        if (!updateReport) {
            throw new Error('Report not found');
        }

        doneKPI += updatedReport.basicSectorSpecificKPI?.completedStatus?.done || 0;
        doneKPI += updatedReport.socialKPI?.completedStatus?.done || 0;
        doneKPI += updatedReport.governanceKPI?.completedStatus?.done || 0;
        doneKPI += updatedReport.environmentKPI?.completedStatus?.done || 0;




        updatedReport.completedStatus = {
            total: 46,
            done: doneKPI
        }
        await updatedReport.save()


        return getReport(id, false, false, role, userId);

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getReport(id, withLast6YearsReports, withActionableInsight, role, userId) {

    if (withLast6YearsReports == undefined) {
        withLast6YearsReports = true;
    }

    if (withActionableInsight == undefined) {
        withActionableInsight = true;
    }

    try {
        let report = await Report.findById(id)
            .populate({
                path: 'organizationDetails.organization',
            })
            .populate('socialKPI')
            .populate('environmentKPI')
            .populate('governanceKPI')
            .populate('basicSectorSpecificKPI');

        const supperAdminStatus = ["sendForVerification", 'vetted', "rejected"];



        if(!report) {
            throw new Error('Report not found 1');
        }

        if(role === "super_admin" && !supperAdminStatus.includes(report.status)) {
            throw new Error('Report not found 2');
        }

        if(role && role != "admin" && role != "super_admin" && !report.assignUsers.includes(userId)) {
            throw new Error('Report not found 3');
        }

    


        report = report.toJSON();

        if (withLast6YearsReports && report.last6YearsReports && report.last6YearsReports.length > 0) {

            report.last6YearsReports = await Promise.all(report.last6YearsReports.map(async (id) => {
                const tempReport = await getReport(id, false, false, role, id);
                return tempReport;
            }));
        }

        if (report.score && withActionableInsight) {
            const actionableInsights = await findActionableInsight(report);
            report.actionableInsights = actionableInsights;
        }

        if(role && role !=="super_admin") {
            report.unReadMessage = (await totalUnReadMessagesInReport({reportId: report._id, userId})).data.unReadMessage;
            const kpis = [
                {name: "basicSectorSpecificKPI", data: report.basicSectorSpecificKPI},
                {name: "environmentKPI", data: report.environmentKPI},
                {name: "socialKPI", data: report.socialKPI},
                {name: "governanceKPI", data: report.governanceKPI}
            ];


            for(const kpi of kpis) {
                if(kpi.data) {
                    
                    const kpiCodes = Object.keys(kpi.data).filter(key => key.match(/^[BEGS]\d+$/));                   
                    for(const kpiCode of kpiCodes) {
                        const unReadMessage = await numberOfUnreadMessages({
                            reportId: report._id,
                            kpiName: kpi.name,
                            code: kpiCode,
                            userId: userId
                        });


                        report[kpi.name][kpiCode].unReadMessage = unReadMessage.data.unReadMessage;
                    }
                }
            }
        }


        return getReportDTO(report, role === "super_admin" || report.status === "rejected" || report.status === "vetted", role, userId);
    } catch (error) {
        console.log(error);
        throw new Error(`Error fetching report: ${error.message}`);
    }
}

export async function createReport(reportData) {
    try {
        const environmentKPI = await createEmptyEnvironmentKPI();
        const basicSectorSpecificKPI = await createEmptyBasicSectorSpecificKPI();
        const socialKPI = await createEmptySocialKPI();

        const newReport = new Report({
            ...reportData,
            environmentKPI: environmentKPI.id,
            basicSectorSpecificKPI: basicSectorSpecificKPI.id,
            socialKPI: socialKPI.id,
        });

        await newReport.save();
        return getReportDTO(newReport);
    } catch (error) {
        throw new Error(`Error creating report: ${error.message}`);
    }
}

export async function genrateReport(id) {

    try {

        const report = await Report.findById(id)
            .populate({
                path: 'organizationDetails.organization',
            })
            .populate('socialKPI')
            .populate('environmentKPI')
            .populate('governanceKPI')
            .populate('basicSectorSpecificKPI');

        
        
        const sectionBReport = await genrateSectionBReportService(report.basicSectorSpecificKPI._id, report.organizationDetails.organization.country, report.year);
        const sectionEReport = await genrateSectionEReportService(report.environmentKPI._id,report.basicSectorSpecificKPI.B3.totalHazardousWaste,report.basicSectorSpecificKPI.B4.totalNonHazardousWaste);
        const sectionSReport = await genrateSectionSReportService(report.socialKPI._id);
        const sectionGReport = await genrateSectionGReportService(report.governanceKPI._id, report.basicSectorSpecificKPI.B1.grossRevenue);

        const reportScore = (sectionBReport.score + sectionEReport.score + sectionGReport.score + sectionSReport.score) / 4;
        const reportGrade = getGrade(reportScore);
        report.score = reportScore;
        report.grade = reportGrade;
        await report.save()

        return await getReport(id);
    } catch (error) {
        console.log(error);
        throw error;
    }


}

export async function generateAIReport(id, files, useOldFiles) {
    try {
        const report = await Report.findById(id);
        if (!report) {
            throw new Error('Report not found');
        }

        if (useOldFiles && report.filesUploaded) {
            // Limit to 15 files, removing old ones if needed
            report.filesUploaded = [...report.filesUploaded, ...files].slice(-15);
        } else {
            report.filesUploaded = files;
        }
        await report.save();

        const year = report.year

        fetchAndAddDataPointsForAI(report.filesUploaded, id, year);

        return { message: "AI is processing" };
    } catch (error) {
        throw error;
    }
}

const fetchAndAddDataPointsForAI = async (files, id, year) => {
    try {
        const response = await fetchDataPointsFromAI(files, year);
        const result = await updateReport(id, response);
        const io = getIO();
        io.emitAIResponse(id);
    } catch (error) {
        console.log(error, "error ai");
        const io = getIO();
        io.rejectAIResponse(id);
    }
}

export async function getAllReports({ status, statusArray, organization }, role, userId) {
    try {
        let query = {};
        if (status) {
            if (status == "sendForVerification") {
                query.status = { $in: ["sendForVerification", "rejected"] };
            } else {
                query.status = status;
            }
        }

        if (statusArray) {
            query.status = { $in: statusArray };
        }

        // Add filter for organization
        if (organization) {
            query['organizationDetails.organization'] = organization;
        }

        if (role != "admin")
            query.assignUsers = { $in: userId }


        // First, get the reports without populating units
        const reports = await Report.find(query)
            .populate({
                path: 'organizationDetails.organization',
                select: 'name industry'
            })
            .sort({ createdAt: -1 });

        // Process each report to handle unit population safely
        const processedReports = await Promise.all(reports.map(async (report) => {
            const reportObj = report.toObject();
            
            // Safely handle unit references
            if (reportObj.organizationDetails) {
                if (reportObj.organizationDetails.unitsProduced) {
                    if(reportObj.organizationDetails.unitsProduced.unit) {
                        const unitObject = await Unit.findById(reportObj.organizationDetails.unitsProduced.unit);
                        if (!unitObject) {
                            reportObj.organizationDetails.unitsProduced.unit = null;
                        }
                        reportObj.organizationDetails.unitsProduced.unit = unitObject;
                    }
                    else
                        reportObj.organizationDetails.unitsProduced.unit = null;
                }
                if (reportObj.organizationDetails.rawMaterialConsumption) {
                   if(reportObj.organizationDetails.rawMaterialConsumption.unit) {
                        const unitObject = await Unit.findById(reportObj.organizationDetails.rawMaterialConsumption.unit);
                        if (!unitObject) {
                            reportObj.organizationDetails.rawMaterialConsumption.unit = null;
                        }
                        reportObj.organizationDetails.rawMaterialConsumption.unit = unitObject;
                    }
                    else
                        reportObj.organizationDetails.rawMaterialConsumption.unit = null;
                }
            }

            if(role && role!=="super_admin") {
                const unReadMessage = await totalUnReadMessagesInReport({reportId: reportObj._id, userId});
                reportObj.unReadMessage = unReadMessage.data.unReadMessage;
            }
                
            
            return reportObj;
        }));

        return processedReports.map(report => getReportDTO(report));
    } catch (error) {
        console.log(error);
        throw new Error(`Error fetching reports: ${error.message}`);
    }
}

export async function updateReportStatus(reportId, newStatus) {
    try {
        const report = await Report.findById(reportId);
        if (!report) {
            throw new Error('Report not found');
        }

        const validTransitions = {
            draft: ['ready', 'sendForVerification'],
            ready: ['ready', 'sendForVerification'],
            rejected: ['sendForVerification']
        };

        // if (!validTransitions[report.status] || !validTransitions[report.status].includes(newStatus)) {
        //     throw new Error('Invalid status transition');
        // }

        report.status = newStatus;
        if (report.status == "sendForVerification") {
            if (!report.sendForApproval) {
                report.sendForApproval = [];
            }

            const tempObject = {
                type: report.sendForApproval.length > 0 ? "resubmit" : "submit",
                status: "pending",
                createdAt: new Date()
            };
            report.sendForApproval.push(tempObject);
        }

        await report.save();

        if (report.status == "sendForVerification") {
            await addSectionBApprovalComponentService(report.basicSectorSpecificKPI, { senderForVerification: report.sendForApproval[report.sendForApproval.length - 1]._id });
            await addSectionEApprovalComponentService(report.environmentKPI, { senderForVerification: report.sendForApproval[report.sendForApproval.length - 1]._id });
            await addSectionSApprovalComponentService(report.socialKPI, { senderForVerification: report.sendForApproval[report.sendForApproval.length - 1]._id });
            await addSectionGApprovalComponentService(report.governanceKPI, { senderForVerification: report.sendForApproval[report.sendForApproval.length - 1]._id });
        }

        return { message: 'Report status updated successfully', report: getReportDTO(report) };
    } catch (error) {
        throw new Error(`Error updating report status: ${error.message}`);
    }
}

export async function getLast6YearsReports(organizationId, year, segment) {
    try {

        let reports = await getAllReports({ status: "vetted", organization: organizationId },"admin");

        const uniqueReports = new Map();
        const currentYear = parseInt(year);
        const startYear = currentYear - 5;
        const segmentOrder = { "Q1": 1, "Q2": 2, "Q3": 3, "Q4": 4 };

        reports.forEach(report => {
            const reportYear = parseInt(report.year);
            if (reportYear >= startYear && reportYear <= currentYear) {
                const key = `${report.year}${report.segment}`;
                if (reportYear < currentYear ||
                    (reportYear === currentYear && segmentOrder[report.segment] < segmentOrder[segment])) {
                    if (!uniqueReports.has(key) || uniqueReports.get(key).createdAt < report.createdAt) {
                        uniqueReports.set(key, report);
                    }
                }
            }
        });

        reports = Array.from(uniqueReports.values());

        reports.sort((a, b) => {
            if (a.year === b.year) {
                return segmentOrder[a.segment] - segmentOrder[b.segment];
            }
            return parseInt(a.year) - parseInt(b.year);
        });

        const result = reports.map(report => report.id);
        return result;
    } catch (error) {
        throw new Error(`Error fetching last 6 years reports: ${error.message}`);
    }
}

export async function findActionableInsight(report) {
    try {

        const actionableInsights = [];

        // Check BasicSectorSpecificKPI
        if (report.basicSectorSpecificKPI) {
            const basicInsights = await checkBasicSectorInsights(report.basicSectorSpecificKPI);
            actionableInsights.push(...basicInsights);
        }

        // Check EnvironmentKPI
        if (report.environmentKPI) {
            const environmentInsights = await checkEnvironmentInsights(report.environmentKPI);
            actionableInsights.push(...environmentInsights);
        }

        // Check SocialKPI
        if (report.socialKPI) {
            const socialInsights = await checkSocialInsights(report.socialKPI);
            actionableInsights.push(...socialInsights);
        }

        // Check GovernanceKPI
        if (report.governanceKPI) {
            const governanceInsights = await checkGovernanceInsights(report.governanceKPI);
            actionableInsights.push(...governanceInsights);
        }

        return actionableInsights.map((item) => getActionableInsightDTO(item));
    } catch (error) {
        throw new Error(`Error finding actionable insights: ${error.message}`);
    }
}

async function checkBasicSectorInsights(basicSectorKPI) {
    const { B1, B2, B3, B4, B5, B6 } = basicSectorKPI;

    const insights = [];

    const sections = [
        { name: 'B1', data: B1 },
        { name: 'B2', data: B2 },
        { name: 'B3', data: B3 },
        { name: 'B4', data: B4 },
        { name: 'B5', data: B5 },
        { name: 'B6', data: B6 }
    ];

    for (const section of sections) {
        if (section?.data?.normalizedValue < 0.4) {
            const insight = await getActionableInsight(section.name);
            insights.push(insight);
        }
    }

    return insights;
}

async function checkEnvironmentInsights(environmentKPI) {
    const { E1, E2, E3, E4, E5, E6, E7, E8, E9 } = environmentKPI;

    const insights = [];

    const sections = [
        { name: 'E1', data: E1 },
        { name: 'E2', data: E2 },
        { name: 'E3', data: E3 },
        { name: 'E4', data: E4 },
        { name: 'E5', data: E5 },
        { name: 'E6', data: E6 },
        { name: 'E7', data: E7 },
        { name: 'E8', data: E8 },
        { name: 'E9', data: E9 }
    ];

    for (const section of sections) {
        if ( section?.data?.normalizedValue <  0.4) {
            const insight = await getActionableInsight(section.name);
            insights.push(insight);
        }
    }

    return insights;
}

async function checkSocialInsights(socialKPI) {
    const { S1, S2, S3, S4, S5, S6, S7, S8 } = socialKPI;

    const insights = [];

    const sections = [
        { name: 'S1', data: S1 },
        { name: 'S2', data: S2 },
        { name: 'S3', data: S3 },
        { name: 'S4', data: S4 },
        { name: 'S5', data: S5 },
        { name: 'S6', data: S6 },
        { name: 'S7', data: S7 },
        { name: 'S8', data: S8 },
    ];

    for (const section of sections) {
        if (section?.data?.normalizedValue <  0.4) {
            const insight = await getActionableInsight(section.name);
            insights.push(insight);
        }
    }

    return insights;
}

async function checkGovernanceInsights(governanceKPI) {
    const { G1, G2, G3, G4, G5, G6, G7, G8, G9, G10 } = governanceKPI;

    const insights = [];

    const sections = [
        { name: 'G1', data: G1 },
        { name: 'G2', data: G2 },
        { name: 'G3', data: G3 },
        { name: 'G4', data: G4 },
        { name: 'G5', data: G5 },
        { name: 'G6', data: G6 },
        { name: 'G7', data: G7 },
        { name: 'G8', data: G8 },
        { name: 'G9', data: G9 },
        { name: 'G10', data: G10 },
    ];

    for (const section of sections) {
        if (section?.data?.normalizedValue <  0.4) {
            const insight = await getActionableInsight(section.name);
            insights.push(insight);
        }
    }

    return insights;
}

export async function getActionableInsight(code) {
    return await ActionableInsight.findOne({ code: code });
}

export async function getAllReportsForAdmin(status) {
    try {
        const query = { status: "sendForVerification" };

        if (status == "vetted")
            query.status = "vetted";

        const reports = await Report.find(query)
            .populate({
                path: 'organizationDetails.organization',
                select: 'name industry'
            });

        const reportsDTO = await Promise.all(reports.map(async (report) => {
            report = report.toJSON();
            if(!report.organizationDetails.organization) {
                return null;
            }
            const adminUsers = await getUsersOnOrganization({ organization: report.organizationDetails.organization._id, role: "admin" });
            report.organizationDetails.organization.admin = adminUsers[0];
            if (status && status != "vetted") {
                const lastApproval = report.sendForApproval[report.sendForApproval.length - 1];
                if (!lastApproval) {
                    return null;
                }

                if (status == "resubmit" && lastApproval.type == "resubmit") {
                    return getReportDTO(report);
                } else if (status == "inProgress" && lastApproval.status == "inProgress") {
                    return getReportDTO(report);
                } else if (status === "latest" && lastApproval.status === "pending" && lastApproval.type === "submit") {
                    return getReportDTO(report);
                } else {
                    return null;
                }
            } else {
                return getReportDTO(report);
            }
        }));

        return reportsDTO.filter(Boolean); // Remove null values

    } catch (error) {
        console.log(error,"admin error");
        throw new Error(`Error fetching reports: ${error.message}`);
    }
}

export async function updateReportApprovalStatus(reportId, kpiName, code, status, message, userId) {
    try {
        const report = await Report.findById(reportId);
        if (!report) {
            throw new Error('Report not found');
        }

        let updateResult;

        switch (kpiName) {
            case 'basicSectorSpecificKPI':
                updateResult = await updateBasicSectorSpecificKPIApprovalStatusService(report.basicSectorSpecificKPI, code, status, message, userId);
                break;
            case 'environmentKPI':
                updateResult = await updateEnvironmentKPIApprovalStatusService(report.environmentKPI, code, status, message, userId);
                break;
            case 'socialKPI':
                updateResult = await updateSocialKPIApprovalStatusService(report.socialKPI, code, status, message, userId);
                break;
            case 'governanceKPI':
                updateResult = await updateGovernmentKPIApprovalStatusService(report.governanceKPI, code, status, message, userId);
                break;
            default:
                throw new Error('Invalid KPI name');
        }

        // Find the last sendForVerification entry and update its status
        if (report.sendForApproval && report.sendForApproval.length > 0) {
            const lastIndex = report.sendForApproval.length - 1;
            report.sendForApproval[lastIndex].status = "inProgress";
            await report.save();
        }

        return { message: 'KPI approval status updated successfully' };
    } catch (error) {
        throw new Error(`Error updating KPI approval status: ${error.message}`);
    }
}

export async function checkAndUpdateReportApprovalStatus(reportId) {
    try {
        const report = await Report.findById(reportId)
            .populate('basicSectorSpecificKPI')
            .populate('environmentKPI')
            .populate('socialKPI')
            .populate('governanceKPI');

        if (!report) {
            throw new Error('Report not found');
        }

        const {
            B1, B2, B3, B4, B5, B6
        } = report.basicSectorSpecificKPI;

        const {
            E1, E2, E3, E4, E5, E6, E7, E8, E9
        } = report.environmentKPI;

        const {
            S1, S2, S3, S4, S5, S6, S7, S8
        } = report.socialKPI;

        const {
            G1, G2, G3, G4, G5, G6, G7, G8, G9, G10
        } = report.governanceKPI;

        const allKPIs = [
            B1, B2, B3, B4, B5, B6,
            E1, E2, E3, E4, E5, E6, E7, E8, E9,
            S1, S2, S3, S4, S5, S6, S7, S8,
            G1, G2, G3, G4, G5, G6, G7, G8, G9, G10
        ];

        let anyRejected = false;

        for (const kpi of allKPIs) {
            if (!kpi || !kpi.approvalSchema || !kpi.approvalSchema.length) {
                throw new Error(`KPI ${kpi ? kpi.code : 'unknown'} has not been verified yet`);
            }

            const lastApproval = kpi.approvalSchema[kpi.approvalSchema.length - 1];

            if (lastApproval.status === 'pending') {
                throw new Error(`Some KPI is still pending approval`);
            } else if (lastApproval.status == 'rejected') {
                anyRejected = true;
            }
        }


        if (anyRejected) {
            report.status = 'rejected';
            report.sendForApproval[report.sendForApproval.length - 1].status = "rejected";
        } else {
            report.sendForApproval[report.sendForApproval.length - 1].status = "approved";
            report.status = 'vetted';
            report.approveDate = new Date();
        }


        await report.save();

        return { message: `Report status updated to ${report.status}` };
    } catch (error) {
        console.log(error, "error");
        throw new Error(`Error checking and updating report approval status: ${error.message}`);
    }
}

export async function getVettedReportCountByMonthYear(year, month, timezone = 'UTC') {
    try {
        // Create start and end dates for the given month and year
        const startDate = moment.tz({ year, month: month - 1, day: 1 }, timezone).startOf('day').toDate();
        const endDate = moment.tz({ year, month: month - 1, day: 1 }, timezone).endOf('month').toDate();

        // Query the database for vetted reports within the date range
        const count = await Report.countDocuments({
            status: 'vetted',
            approveDate: {
                $gte: startDate,
                $lte: endDate
            }
        });

        return { count };
    } catch (error) {
        throw new Error(`Error getting vetted report count: ${error.message}`);
    }
}

export const assignKPIsToUsers = async (reportId, validatedData, userId, organization) => {
    try {
        const { kpiName, code, assign: assignUsers } = validatedData
        const report = await Report.findById(reportId);
        if (!report) {
            throw new Error('Report not found');
        }

        let updateResult;

        switch (kpiName) {
            case 'basicSectorSpecificKPI':
                updateResult = await addAssignUsersInBasicSectorKPIService(report.basicSectorSpecificKPI, code, assignUsers);
                break;
            case 'socialKPI':
                updateResult = await addAssignUsersInSocialKPIService(report.socialKPI, code, assignUsers);
                break;
            case 'governanceKPI':
                updateResult = await addAssignUsersInGovernmentKPIService(report.governanceKPI, code, assignUsers);
                break;
            case 'environmentKPI':
                updateResult = await addAssignUsersInEnvironmentKPIService(report.environmentKPI, code, assignUsers);
                break;
            default:
                throw new Error('Invalid KPI type');
        }

        if (!report.assignUsers)
            report.assignUsers = [];

        // Add new users without duplicates
        report.assignUsers = [...new Set([...report.assignUsers, ...assignUsers])];

        await report.save();

        return {
            success: true,
            message: 'Users assigned successfully',
            data: updateResult
        };
    } catch (error) {
        throw new Error(`Error assigning users to KPI: ${error.message}`);
    }
};

export const assignUsersToSection = async (reportId, kpiName, code) => {
    try {
      const report = await Report.findById(reportId)
      .populate({
        path: kpiName,
        populate: { path: code }
      });

      if (!report) {
        throw new Error('Report not found');
      }

      const kpi = report[kpiName];

      if (!kpi) {
        throw new Error(`KPI ${kpiName} not found`);
      }

      if (!kpi[code]) {
        throw new Error(`KPI ${code} not found in ${kpiName}`);
      }

      if (!kpi[code].assign) {
        return {
            assignMembers: [],
            success: true
        }
      }

      const assignMembers = kpi[code].assign.assignMembers;
      const adminusers = await getUsersOnOrganization({ organization: report.organizationDetails.organization._id, role: "admin" });


      return {
        assignMembers:[...adminusers.map(user => user.id), ...assignMembers],    
        success: true
      }

    } catch (error) {
        throw error;
    }
};

export const deleteReport = async (reportId) => {
    try {
        const report = await Report.findById(reportId);
        if (!report) {
            throw new Error('Report not found');
        }

        const statuses = ['draft', 'ready'];
        if (!statuses.includes(report.status)) {
            throw new Error('Report cannot be deleted');
        }
        
        await BasicSectorSpecificKPI.deleteOne({ _id: report.basicSectorSpecificKPI });
        await EnvironmentKPI.deleteOne({ _id: report.environmentKPI });
        await SocialKPI.deleteOne({ _id: report.socialKPI });
        await GovernmentKPI.deleteOne({ _id: report.governanceKPI });
        await Report.deleteOne({ _id: reportId });
        return { message: 'Report deleted successfully' };
    } catch (error) {
        throw new Error(`Error deleting report: ${error.message}`);
    }
} 

export const addSuppotingDocuments = async (reportId, files, userId) => {
    try {
        const report = await Report.findById(reportId);
        if (!report) {
            throw new Error('Report not found');
        }
        
        if(report.status != "sendForVerification") {
            throw new Error('Report is not in sendForVerification status');
        }

        if(!report.supportingDocuments) {
            report.supportingDocuments = [];
        }

        report.supportingDocuments.push(...files);
        await report.save();

        return { message: 'Documents added successfully' };
    }catch(error){
        throw error;
    }
}

export const getSupportingDocument = async ({reportId,key}) => {
    try {
        const report = await Report.findById(reportId);
        if (!report) {
            throw new Error('Report not found');
        }

        const supportingDocument = report.supportingDocuments.find(doc => doc.key === key);
        if(!supportingDocument) {
            throw new Error('File not found');
        }

        const file = await getFileFromS3(key);
        
        return {
            success: true,
            data: {
                ...file,
                name: supportingDocument.name
            }
        };

    } catch (error) {
        throw error;
    }
}
