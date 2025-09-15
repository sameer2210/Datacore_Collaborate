import pkg from 'joi';
const Joi = pkg;

// Request DTOs
export const createSubscriptionPlanDto = Joi.object({
    name: Joi.string()
        .required()
        .trim()
        .messages({
            'string.empty': 'Name cannot be empty',
            'any.required': 'Name is required'
        }),
    description: Joi.string()
        .allow('')
        .trim()
        .messages({
            'any.required': 'Description is required'
        }),
    price: Joi.number()
        .required()
        .min(0)
        .messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price cannot be negative',
            'any.required': 'Price is required'
        }),
    duration: Joi.number()
        .required()
        .min(1)
        .messages({
            'number.base': 'Duration must be a number',
            'number.min': 'Duration must be at least 1 day',
            'any.required': 'Duration (in days) is required'
        }),
    features: Joi.object().keys({
        numberOfMembers: Joi.alternatives().try(
            Joi.string().valid('Infinity'),
            Joi.number().min(0)
        ).custom((value, helpers) => {
            return value === 'Infinity' ? -1 : value;
        })
        .required()
        .messages({
            'number.base': 'Number of members must be a number',
            'number.min': 'Number of members must be at least 1 or "Infinity"',
            'any.required': 'Number of members is required'
        }),
        numberOfVettiedReports: Joi.alternatives().try(
            Joi.string().valid('Infinity'),
            Joi.number().min(0)
        ).custom((value, helpers) => {
            return value === 'Infinity' ? -1 : value;
        })
        .required()
        .messages({
            'number.base': 'Number of vetted reports must be a number',
            'number.min': 'Number of vetted reports must be at least 1 or "Infinity"',
            'any.required': 'Number of vetted reports is required'
        }),
        numberOfReports: Joi.alternatives().try(
            Joi.string().valid('Infinity'),
            Joi.number().min(0)
        ).custom((value, helpers) => {
            return value === 'Infinity' ? -1 : value;
        })
        .required()
        .messages({
            'number.base': 'Number of reports must be a number',
            'number.min': 'Number of reports must be at least 1 or "Infinity"',
            'any.required': 'Number of reports is required'
        })
    }).required()
});

export const updateSubscriptionPlanDto = Joi.object({
    name: Joi.string()
        .trim(),
    description: Joi.string()
        .allow('')
        .trim(),
    price: Joi.number()
        .min(0),
    duration: Joi.number()
        .min(1)
        .messages({
            'number.base': 'Duration must be a number',
            'number.min': 'Duration must be at least 1 day',
            'any.required': 'Duration (in days) is required'
        }),
    features: Joi.object().keys({
        numberOfMembers: Joi.alternatives().try(
            Joi.string().valid('Infinity'),
            Joi.number().min(1)
        ).custom((value, helpers) => {
            return value === 'Infinity' ? -1 : value;
        }),
        numberOfVettiedReports: Joi.alternatives().try(
            Joi.string().valid('Infinity'),
            Joi.number().min(1)
        ).custom((value, helpers) => {
            return value === 'Infinity' ? -1 : value;
        }),
        numberOfReports: Joi.alternatives().try(
            Joi.string().valid('Infinity'),
            Joi.number().min(1)
        ).custom((value, helpers) => {
            return value === 'Infinity' ? -1 : value;
        })
    })
});

// Response DTOs
export const subscriptionPlanResponse = (plan) => {
    return {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        features: {
            numberOfMembers: plan.features.numberOfMembers=="-1" ? "Infinity" : plan.features.numberOfMembers,
            numberOfVettiedReports: plan.features.numberOfVettiedReports=="-1" ? "Infinity" : plan.features.numberOfVettiedReports,
            numberOfReports: plan.features.numberOfReports=="-1" ? "Infinity" : plan.features.numberOfReports
        },
        status: plan.status,
        createdAt: plan.createdAt,
        currency: plan.currency,
        defaultPlan: plan.defaultPlan,
        updatedAt: plan.updatedAt
    }
};

// Validation functions
export const validateCreateSubscriptionPlan = (data) => {
    const { error, value } = createSubscriptionPlanDto.validate(data, { abortEarly: false });
    if (error) {
        throw new Error(JSON.stringify({
            message: 'Validation Error',
            errors: error.details.map(detail => ({
                field: detail.context.key,
                message: detail.message
            }))
        }));
    }
    return value;
};

export const validateUpdateSubscriptionPlan = (data) => {
    const { error, value } = updateSubscriptionPlanDto.validate(data, { abortEarly: false });
    if (error) {
        throw new Error(JSON.stringify({
            message: 'Validation Error',
            errors: error.details.map(detail => ({
                field: detail.context.key,
                message: detail.message
            }))
        }));
    }
    return value;
};


export const activePlanResponse = (data) => {

    return{
        id: data._id,
        planId: data.planId,
        userId: data.userId,
        numberOfMembers: data.numberOfMembers==-1 ? "Infinity" : data.numberOfMembers,
        numberOfVettiedReports: data.numberOfVettiedReports === -1 ? "Infinity" : data.numberOfVettiedReports,
        numberOfReports: data.numberOfReports === -1 ? "Infinity" : data.numberOfReports,
        expiresAt: data.expiresAt,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    }
}