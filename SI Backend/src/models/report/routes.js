import express from 'express';
import { initiateReportCreation, getSupportingDocument, updateReport,deleteReportController, getReport, genrateReport, genrateAIReport, getAllReport, updateReportStatus, getActionableInsight,addSuppotingDocuments, updateApprovalStaus, submitReportFromAdmin, getVettedReportCount, assignKPIs } from './controller.js';
import authenticated from '../../middleware/authenticated.js';
import roleValidation, { Roles } from "../../middleware/roleValidation.js";
import { exceedVettedReportsLimitMiddleware, checkQuotaForReportsMiddleware} from "../../middleware/quota.js";

const router = express.Router();

router.post('/initiate', authenticated,checkQuotaForReportsMiddleware, initiateReportCreation);
router.put('/:id', authenticated, updateReport);
router.get("/actionable-insight/:id", authenticated, getActionableInsight);
router.get('/vetted-count', authenticated, roleValidation([Roles.SUPER_ADMIN]), getVettedReportCount);
router.get('/:id', authenticated, getReport);
router.get('/', authenticated, getAllReport);
router.post('/genrate/:id', authenticated, genrateReport);
router.post("/ai/:id", authenticated, genrateAIReport);
router.put("/update-status/:id", authenticated,exceedVettedReportsLimitMiddleware, updateReportStatus);
router.put("/update-approval-staus/:id", authenticated, roleValidation([Roles.SUPER_ADMIN]), updateApprovalStaus);
router.put("/submit/:id", authenticated, roleValidation([Roles.SUPER_ADMIN]), submitReportFromAdmin);
router.put("/assign/:id", authenticated, roleValidation([Roles.ADMIN]), assignKPIs);
router.delete('/:id', authenticated, roleValidation([Roles.ADMIN]), deleteReportController);
router.post('/add-supporting-documents/:id', authenticated,roleValidation([Roles.ADMIN]),addSuppotingDocuments);
router.get('/supporting-document/:id', authenticated,roleValidation([Roles.ADMIN,Roles.SUPER_ADMIN]),getSupportingDocument);
export default router;
