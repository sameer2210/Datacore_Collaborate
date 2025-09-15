import {SubscriptionPlan, InitiatePayment,Quota} from './model.js';
import { subscriptionPlanResponse,activePlanResponse } from './dto.js';
import Stripe from 'stripe';
import { getUser,getUsersOfOrganization } from "../user/service.js";
import { getAllReports } from "../report/service.js";


export const createSubscriptionPlan = async ({
    name,
    description,
    price,
    duration,
    features,
    userId
}, { session } = {}) => {
    try {
    
        const plan = await SubscriptionPlan.create([{
            name,
            description,
            price,
            duration,
            features,
            createdBy: userId,
            updatedBy: userId
        }], { session });

        return {
            success: true,
            data: subscriptionPlanResponse(plan[0])
        };
    } catch (error) {
        throw error;
    }
};

export const updateSubscriptionPlan = async (planId, updateData, userId, { session } = {}) => {
    try {
        const plan = await SubscriptionPlan.findById(planId).session(session);
        if (!plan) {
            throw new Error('Subscription plan not found');
        }

       if(updateData.name) {
            plan.name = updateData.name;
        }
        if(updateData.description) {
            plan.description = updateData.description;
        }
        // if(updateData.price) {
        //     plan.price = updateData.price;
        // }
        if (updateData.hasOwnProperty('price')) {
            plan.price = updateData.price;
        }
        if(updateData.duration) {
            plan.duration = updateData.duration;
        }
        if(updateData?.features?.numberOfMembers) {
            plan.features.numberOfMembers = updateData?.features?.numberOfMembers;
        }
        if(updateData?.features?.numberOfVettiedReports) {
            plan.features.numberOfVettiedReports = updateData?.features?.numberOfVettiedReports;
        }
        if(updateData?.features?.numberOfReports) {
            plan.features.numberOfReports = updateData?.features?.numberOfReports;
        }

        plan.updatedBy = userId;

        const updatedPlan = await plan.save({ session });

        return {
            success: true,
            data: subscriptionPlanResponse(updatedPlan)
        };
    } catch (error) {
        throw error;
    }
};

export const getSubscriptionPlan = async (planId, { session } = {}) => {
    try {
        const plan = await SubscriptionPlan.findById(planId).session(session);
        if (!plan) {
            throw new Error('Subscription plan not found');
        }

        return {
            success: true,
            data: subscriptionPlanResponse(plan)
        };
    } catch (error) {
        throw error;
    }
};

export const getAllSubscriptionPlans = async ({ session } = {}) => {
    try {

        const plans = await SubscriptionPlan.find({status: 'active'}).session(session);
        return {
            success: true,
            data: plans.map(subscriptionPlanResponse)
        };

    } catch (error) {
        throw error;
    }
};

export const deleteSubscriptionPlan = async (planId, { session } = {}) => {
    try {
        const plan = await SubscriptionPlan.findById(planId).session(session);
        if (!plan) {
            throw new Error('Subscription plan not found');
        }

        // Soft delete in our database by marking as inactive
        const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
            planId,
            { status: 'inactive' },
            { new: true, session }
        );

        return {
            success: true,
            data: subscriptionPlanResponse(updatedPlan)
        };
    } catch (error) {
        throw error;
    }
};

export const activateSubscriptionPlan = async (planId, userId, { session } = {}) => {
    try {
        const plan = await SubscriptionPlan.findById(planId).session(session);
        if (!plan) {
            throw new Error('Subscription plan not found');
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(plan.price * 100), // Stripe expects amount in cents
            currency: plan.currency || 'INR',
            payment_method_types: ['card', 'link'],
            payment_method_options: {
                card: {
                    request_three_d_secure: 'automatic'
                }
            },
            metadata: {
                planId: plan._id.toString(),
                userId: userId,
                planType: 'subscriptionPlan'
            }
        });

        const payment = await InitiatePayment.insertMany([{
            planId: plan._id,
            planType: 'subscriptionPlan',
            userId: userId,
            planPrice: plan.price,
            paymentId: paymentIntent.id,
            currency: plan.currency || 'INR',
            status: 'pending'
        }], { session });

        return {
            success: true,
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentId: payment[0]._id,
                amount: plan.price,
                publishableKey: process.env.STRIPE_API_KEY,
                currency: plan.currency || 'INR',
                sessionId: paymentIntent.id,
            }
        };


    } catch (error) {
        throw error;
    }
};

export const handlePayment = async (paymentIntent, status) => {
    try {

        const payment = await InitiatePayment.findOne({ paymentId: paymentIntent.id });
        if (!payment) {
            throw new Error('Payment not found');
        }

        payment.status = status==="success" ? 'completed' : 'failed';            
        await payment.save();
        
        if(status === 'success') {
            await addNewPlan(payment.planId, payment.userId);
        }

        return {
            success: true,
            data: {
                message: 'Payment status updated',
                paymentId: payment._id,
                status: payment.status
            }
        };
    } catch (error) {            
        throw error;
    }            
};

export const addNewPlan = async (planId,userId) => {
    try {

        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            throw new Error('Subscription plan not found');
        }

        const activePlan = await Quota.findOne({userId: userId, status: 'active' });
        if (activePlan) {
            activePlan.status = 'inactive';
            await activePlan.save();
        }

        const quota = await Quota.create({
            planId: plan._id,
            userId: userId,
            numberOfMembers: plan.features.numberOfMembers,
            numberOfVettiedReports: plan.features.numberOfVettiedReports,
            numberOfReports: plan.features.numberOfReports,
            expiresAt: new Date(new Date().setDate(new Date().getDate() + plan.duration))
        });

    }catch (error) {
        throw error;
    }
};

export const getQuota = async (userId) => {
    try {
        const quota = await Quota.findOne({userId: userId, status: 'active' });
        if (!quota) {
            throw new Error('Quota not found');
        }   

        const plan = await SubscriptionPlan.findById(quota.planId);

        return {
            success: true,
            data: activePlanResponse(quota),
            plan_name: plan.name
        };
    } catch (error) {
        throw error;
    }
};

export const totalRevenue = async ({month, year} = {}) => {
    try {
        const currentDate = new Date();
        const targetMonth = month || currentDate.getMonth() + 1; 
        const targetYear = year || currentDate.getFullYear();

        const total = await InitiatePayment.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: [{ $month: "$createdAt" }, parseInt(targetMonth)] },
                            { $eq: [{ $year: "$createdAt" }, parseInt(targetYear)] },
                            { $eq: ["$status", "completed"] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$planPrice" }
                }
            }
        ]);

        return{ totalRevenue: total[0]?.totalAmount || 0};
    } catch (error) {
        throw error;
    }
};

export const avtivateDefaultPlan = async (userId)=>{

    try {
        const plan = await SubscriptionPlan.findOne({status: 'active' , defaultPlan: true});
        if (!plan) {
            throw new Error('Default plan not found');
        }

        return await addNewPlan(plan._id, userId);
        
    } catch (error) {
        throw error;
    }

}

export const getMonthlyRevenue = async ({year} = {}) => {
    try {
        const currentDate = new Date();
        const targetYear = year || currentDate.getFullYear();

        const monthlyRevenue = await InitiatePayment.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: [{ $year: "$createdAt" }, parseInt(targetYear)] },
                            { $eq: ["$status", "completed"] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    totalAmount: { $sum: "$planPrice" }
                }
            },
            {
                $sort: { "_id.month": 1 }
            }
        ]);

        const revenueArray = Array(12).fill(0);
        monthlyRevenue.forEach(({ _id, totalAmount }) => {
            revenueArray[_id.month - 1] = totalAmount;
        });

        return revenueArray;
    } catch (error) {
        throw error;
    }
};

export const exceedGeneratingReportsLimit =  async ({userId}) => {
    try {

        const user = await getUser(userId,false);
        if (!user) {
            throw new Error('User not found');
        }



        const reports = await getAllReports({organization: user.organization.id},"admin",userId);
        const numberOfReports = reports.length;

        const quota = await getQuota(userId);
        if (!quota) {
            throw new Error('Quota not found');
        }

        if(quota.data.numberOfReports == "Infinity" || quota.data.numberOfReports > numberOfReports) {
            return false;
        } else {
            return true;
        }
        
    } catch (error) {
        throw error;
    }

}

export const exceedVettedReportsLimit =  async ({userId}) => {
    try {   

        const user = await getUser(userId,false);
        if (!user) {
            throw new Error('User not found');
        }

        const reports = await getAllReports({organization: user.organization.id, statusArray: ["vetted"]},"admin",userId);
        const numberOfVettedReports = reports.length;

        const quota = await getQuota(userId);
        if (!quota) {
            throw new Error('Quota not found');
        }

        const plan = await SubscriptionPlan.findById(quota.data.planId); 
        if (!plan) {
            throw new Error("Subscription plan not found");
        }

        if (plan.name === "Basic") {
            throw new Error("Your current plan is 'Basic'. Please upgrade to access more features.");
        }

        if(quota.data.numberOfVettiedReports == "Infinity" || quota.data.numberOfVettiedReports > numberOfVettedReports) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        throw error;
    }
}

export const exceedMembersLimit =  async ({userId}) => {
    try {

        const user = await getUser(userId,false);
        if (!user) {
            throw new Error('User not found');
        }

        const allUsers = await getUsersOfOrganization({ organizationId: user.organization.id});
        const members = allUsers.filter(user => user.role !== "admin").length;

        const quota = await getQuota(userId);
        if (!quota) {
            throw new Error('Quota not found');
        }

        if(quota.data.numberOfMembers == "Infinity" || quota.data.numberOfMembers > members) {
            return false;
        } else {
            return true;
        }
        
    } catch (error) {
        throw error;
    }
}
