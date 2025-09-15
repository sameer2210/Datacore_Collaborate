import { exceedGeneratingReportsLimit, exceedMembersLimit, exceedVettedReportsLimit } from "../models/substribtionPlan/service.js";

export const checkQuotaForReportsMiddleware = async (req, res, next) => {
    try {

        const { userId } = req.user;

        if (await exceedGeneratingReportsLimit({ userId })) {
            throw new Error('Exceeded generating reports limit');
        }
        next();

    } catch (error) {
        next(error);
    }

};

export const exceedVettedReportsLimitMiddleware = async (req, res, next) => {
    try {

        const { userId } = req.user;
        const status = req.body.status;

        if (!status || status !== 'sendForVerification') {
            return next();
        }

        if (await exceedVettedReportsLimit({ userId })) {
            throw new Error('Exceeded vetted reports limit');
        }
        next();

    } catch (error) {
        next(error);
    }
}

export const exceedMembersLimitMiddleware = async (req, res, next) => {
    try {

        const { userId } = req.user;

        if (await exceedMembersLimit({ userId })) {
            throw new Error('Exceeded members limit');
        }
        next();

    } catch (error) {   
        next(error);
    }
}