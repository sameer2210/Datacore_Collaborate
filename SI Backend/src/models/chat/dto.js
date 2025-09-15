import Joi from 'joi';

// Schema definitions
const sendMessageDto = Joi.object({
    message: Joi.string()
        .allow('')
        .messages({
            'string.empty': 'Message is required',
            'any.required': 'Message is required'
        }),
    attachment: Joi.array()
        .items(Joi.object({
            name: Joi.string().required(),
            key: Joi.string().required()
        }))
        .optional(),
    sender: Joi.string()
        .required()
        .messages({
            'any.required': 'Sender is required'
        }),
    reportId: Joi.string()
        .required(),
    kpiName: Joi.string()
        .required(),
    code: Joi.string()
        .required(),

  
});

const getMessagesDto = Joi.object({
    reportId: Joi.string()
        .required(),
    kpiName: Joi.string()
        .required(),
    code: Joi.string()
        .required(),
    sender: Joi.string()
        .required(),
    page: Joi.number()
        .min(1)
        .default(1)
        .messages({
            'number.min': 'Page must be greater than 0'
        }),
    limit: Joi.number()
        .min(1)
        .max(100)
        .default(50)
        .messages({
            'number.min': 'Limit must be greater than 0',
            'number.max': 'Limit cannot exceed 100'
        })
});

const getFileDto = Joi.object({
    reportId: Joi.string()
        .required(),
    kpiName: Joi.string()
        .required(),
    code: Joi.string()
        .required(),
    sender: Joi.string()
        .required(),
    fileId: Joi.string()
        .required(),
    chatId: Joi.string()
        .required()
});

// Validation functions
const validateSendMessageRequest = (data) => {
    const { error, value } = sendMessageDto.validate(data, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.context.key,
            message: detail.message
        }));
        throw new Error(JSON.stringify({ message: 'Validation Error', errors }));
    }

    return value;
};

const validateGetMessagesRequest = (data) => {
    const { error, value } = getMessagesDto.validate(data, { abortEarly: false });

    console.log(error);

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.context.key,
            message: detail.message
        }));
        throw new Error(JSON.stringify({ message: 'Validation Error', errors }));
    }

    return value;
};


const validateGetFileRequest = (data) => {
    const { error, value } = getFileDto.validate(data, { abortEarly: false });

    console.log(error);

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.context.key,
            message: detail.message
        }));
        throw new Error(JSON.stringify({ message: 'Validation Error', errors }));
    }

    return value;
};

// Response formatters
const messageResponse = (message) => ({
    id: message._id,
    message: message.message,
    attachment: message.attachment,
    sender: message.sender,
    status: message.status,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
    code: message.code,
    kpiName: message.kpiName,
    reportId: message.reportId
});

export {
    validateSendMessageRequest,
    validateGetMessagesRequest,
    messageResponse,
    validateGetFileRequest
}; 