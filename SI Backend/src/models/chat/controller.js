import multer from 'multer';
import { createMessage, getFile, getMessages,getAllMessages } from './service.js';
import { validateSendMessageRequest, validateGetMessagesRequest , validateGetFileRequest} from './dto.js';
import { uploadFileToS3 } from '../../util/awsS3.js';
import mongoose from 'mongoose';
import Session from '../auth/model.js';

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB file size limit
    },
    fileFilter: (req, file, cb) => {
        // Accept common file types - adjust as needed
        const allowedTypes = ['image/', 'application/pdf', 'video/', 'audio/', 'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (allowedTypes.some(type => file.mimetype.startsWith(type))) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

const sendMessage = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Handle multiple file uploads
        await new Promise((resolve, reject) => {
            upload.array('attachment', 5)(req, res, (err) => { // Allow up to 5 files
                if (err instanceof multer.MulterError) {
                    reject(new Error('File upload error: ' + err.message));
                } else if (err) {
                    reject(err);
                }
                resolve();
            });
        });

        const { userId } = req.user;
        const attachments = req.files;

        // Upload files to S3 if present
        if (attachments && attachments.length > 0) {
            const attachmentKeys = await Promise.all(
                attachments.map(async (file) => {
                    const { key, name } = await uploadFileToS3(file, "chat-attachments");
                    return { key, name };

                })
            );

            req.body.attachment = attachmentKeys;
        }

        req.body.sender = userId;


        // Validate request body
        const validatedData = validateSendMessageRequest(req.body);

        const result = await createMessage({
            ...validatedData,
        }, { Session });

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: result.data
        });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

const getChatMessages = async (req, res, next) => {   
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId } = req.user;
        req.query.sender = userId;
        
        const validatedData = validateGetMessagesRequest(req.query);
        const result = await getMessages({
            ...validatedData,
        }, { session });

        res.status(200).json({
            success: true,
            message: 'Messages retrieved successfully',
            data: result.data
        });
    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};


const getChatFiles = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        const { userId } = req.user;
        req.query.sender = userId;
        
        const validatedData = validateGetFileRequest(req.query);

        const result = await getFile({
            ...validatedData,
        }, { session });

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

const getAllMessagesController = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { userId , role} = req.user;
        const result = await getAllMessages({role, userId}, { session });
        res.status(200).json({
            success: true,
            message: 'Messages retrieved successfully',
            data: result.data
        });
    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();   
    }
};

export {
    sendMessage,
    getChatMessages,
    getChatFiles,
    getAllMessagesController
};
