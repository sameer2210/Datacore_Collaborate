import mongoose from 'mongoose';
import {
    createSubscriptionPlan,
    updateSubscriptionPlan,
    getSubscriptionPlan,
    getAllSubscriptionPlans,
    deleteSubscriptionPlan,
    activateSubscriptionPlan,
    handlePayment,
    getQuota,
    totalRevenue,
    getMonthlyRevenue
} from './service.js';
import {
    validateCreateSubscriptionPlan,
    validateUpdateSubscriptionPlan
} from './dto.js';
import Stripe from 'stripe';

export const create = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId } = req.user;
        const validatedData = validateCreateSubscriptionPlan(req.body);
        
        const result = await createSubscriptionPlan({
            ...validatedData,
            userId
        }, { session });

        await session.commitTransaction();
        res.status(201).json(result);
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

export const update = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId } = req.user;
        const { planId } = req.params;
        const validatedData = validateUpdateSubscriptionPlan(req.body);

        const result = await updateSubscriptionPlan(
            planId,
            validatedData,
            userId,
            { session }
        );

        await session.commitTransaction();
        res.json(result);
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

export const get = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { planId } = req.params;
        const result = await getSubscriptionPlan(planId, { session });

        await session.commitTransaction();
        res.json(result);
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

export const getAll = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
     
        const result = await getAllSubscriptionPlans({ session });

        await session.commitTransaction();
        res.json(result);
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

export const remove = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { planId } = req.params;
        const result = await deleteSubscriptionPlan(planId, { session });

        await session.commitTransaction();
        res.json(result);
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

export const activateSubscriptionPlanController = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId } = req.user;
        const { planId } = req.params;

        if(!planId) {
            throw new Error('Plan id is required');
        }

        const result = await activateSubscriptionPlan(planId, userId, { session });

        await session.commitTransaction();
        res.json(result);
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
    
};

export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
        // Since we're using express.raw(), req.body is already a Buffer
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePayment(event.data.object, "success");
                break;

            case 'payment_intent.payment_failed':
                await handlePayment(event.data.object, "failed");
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

export const getUserQuota = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const response = await getQuota(userId);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export const totalRevenueController = async (req, res, next) => {
    try {

        const { month, year } = req.query;
        const response = await totalRevenue({month, year});
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export const getMonthlyRevenueController = async (req, res, next) => {
    try {
        const { year } = req.query;
        const response = await getMonthlyRevenue({year});
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};