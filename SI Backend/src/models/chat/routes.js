import express from 'express';
import {
    sendMessage,
    getChatMessages,
    getChatFiles,
    getAllMessagesController
} from './controller.js';
import authenticated from '../../middleware/authenticated.js';


const router = express.Router();

// Send a new message
router.post(
    '/send',
    authenticated,
    sendMessage
);

// Get messages for a chat
router.get(
    '/messages',
    authenticated,
    getChatMessages
);

router.get('/all-messages', authenticated, getAllMessagesController);

router.get(
    '/file',
    authenticated,
    getChatFiles
);

export default router; 