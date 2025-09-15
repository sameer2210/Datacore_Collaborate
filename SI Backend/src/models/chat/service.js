import {Chat,LastMessageFetch} from './module.js';
import { messageResponse } from './dto.js';
import { assignUsersToSection, getReport ,getAllReports} from "../report/service.js";
import { getFileFromS3 } from '../../util/awsS3.js';
import { getIO} from '../../socket/socketSetup.js';
import { getUser } from '../user/service.js';

export const createMessage = async ({
    message,
    attachment,
    sender,
    reportId,
    kpiName,
    code,
}) => {
    const {assignMembers} = await assignUsersToSection(reportId, kpiName, code);
    const users = assignMembers.map(member => member.toString());

    if(!users || users.length === 0 || !users.includes(sender)) {
        throw new Error('You are not assigned to this section');
    }

    try {
        const newMessage = await Chat.create({
            message,
            attachment,
            sender,
            reportId,
            kpiName,
            code,
            status: 'sent',
            createdBy: sender,
            updatedBy: sender
        });

        const messageResponseDTO = messageResponse(newMessage);

        // Emit message to all assigned users except sender
        users.forEach(userId => {
            if (userId !== sender) {
                const io = getIO();
                io.newMessage(userId, messageResponseDTO);
            }
        });

        return {
            success: true,
            data: messageResponseDTO
        };
    } catch (error) {
        console.error('Create message error:', error);
        throw error;
    }
};

export const getMessages = async ({
    reportId,
    kpiName,
    code,
    sender,
    page = 1,
    limit = 50
}) => {

    const {assignMembers} = await assignUsersToSection(reportId, kpiName, code);
    const users = assignMembers.map(member => member.toString());


    if(!users || users.length === 0 || !users.includes(sender)) {
        throw new Error('You are not assigned to this section');
    }

    
    try {

        if(!reportId || !kpiName || !code) {
            throw new Error('Missing reportId, kpiName or code');
        }

        
        const skip = (page - 1) * limit;
        let query = { reportId, kpiName, code };


        const messages = await Chat.find(query)
            .sort({ createdAt: -1 }) // Latest messages
            .skip(skip)
            .limit(limit);

        const messagesResponseDTO = messages.map(messageResponse);
        await updateLastMessageFetch({reportId, kpiName, code, userId: sender});

        return {
            success: true,
            data: messagesResponseDTO
        };

    } catch (error) {
        console.error('Get messages error:', error);
        throw error;
    }
};

export const getFile = async ({fileId, reportId, kpiName, code, sender, chatId}) => {
    try {
        const {assignMembers} = await assignUsersToSection(reportId, kpiName, code);
        const users = assignMembers.map(member => member.toString());

        if(!users || users.length === 0 || !users.includes(sender)) {
            throw new Error('You are not assigned to this section');
        }

        const chat = await Chat.findById(chatId);

        if (!chat) {
            throw new Error('Chat not found');
        }

        const attachment = chat.attachment.find(att => att.key === fileId);
        
        if(!attachment) {
            throw new Error('File not found');
        }

        const file = await getFileFromS3(fileId);
        
        return {
            success: true,
            data: {
                ...file,
                name: attachment.name
            }
        };

    } catch (error) {
        throw error;
    }
}

export const lastMessageFetch = async ({reportId, kpiName, code, userId}) => {
    try {

        const lastMessageFetch = await LastMessageFetch.findOne({reportId, kpiName, code, userId});

        if(!lastMessageFetch) {
            return {
                success: false,
                data: {}
            }
           
        }

        return {
            success: true,
            data: lastMessageFetch
        }
    } catch (error) {

        return{
            success: false,
            data: {}
        }
    }
}

export const updateLastMessageFetch = async ({reportId, kpiName, code, userId}) => {
    try {

        let lastMessageFetch = await LastMessageFetch.findOne({reportId, kpiName, code, userId});

        if(!lastMessageFetch) {
            lastMessageFetch = await LastMessageFetch.create({
                reportId,
                kpiName,
                code,
                userId,
                lastMessageFetch: Date.now()
            });
        }

        lastMessageFetch.lastMessageFetch = Date.now();
        await lastMessageFetch.save();

        return {
            success: true,
            data: lastMessageFetch
        }           

    }catch (error) {
        throw error;
    }
}

export const numberOfUnreadMessages = async ({reportId, kpiName, code, userId}) => {
    try {

        const lastMessageFetch = await LastMessageFetch.findOne({reportId, kpiName, code, userId});
        const query = { reportId, kpiName, code };

        if(lastMessageFetch) {
            query.createdAt = { $gt: lastMessageFetch.lastMessageFetch };
        }

        const numberOfUnreadMessages = await Chat.countDocuments(query);


        return {
            success: true,
            data: {unReadMessage:numberOfUnreadMessages}
        }

    } catch (error) {
        console.log(error,"numberOfUnreadMessages");
        return {
            success: false,
            data: {unReadMessage:0}
        }
    }
}

export const totalUnReadMessagesInReport = async ({reportId, userId}) => {
    try {

        const chats = await Chat.find({reportId});
        const uniquePairs = Array.from(
            new Set(chats.map(chat => `${chat.kpiName}-${chat.code}`))
        ).map(pair => {
            const [kpiName, code] = pair.split('-');
            return {
                kpiName,code,reportId
            };
        });

        let count = 0;


        for (const chat of uniquePairs) {
            const countOfUnreadMessages = await numberOfUnreadMessages({reportId: chat.reportId, kpiName: chat.kpiName, code: chat.code, userId});
            count += countOfUnreadMessages.data.unReadMessage;
        }

        return {
            success: true,
            data: {unReadMessage: count}
        }

    } catch (error) {
        console.log(error,"totalUnReadMessagesInReport");
        return {
            success: false,
            data: {unReadMessage:0}
        }   
    }
}

export const getAllMessages = async ({role, userId}) => {
    try {
        const user = await getUser(userId,false);
        const reports = await getAllReports({organization: user.organization.id}, role, userId);
        let messages = [];
        let totalUnReadMessages  = 0;

        for (const report of reports) {
            const messagesOfKpi = await Chat.find({ reportId: report.id, sender: { $ne: userId } });
            messages.push(...messagesOfKpi);
            const totalUnReadMessagesOfReport = await totalUnReadMessagesInReport({reportId: report.id, userId});
            totalUnReadMessages += totalUnReadMessagesOfReport.data.unReadMessage;     
        }

        if (role === "member") {
            const filteredMessages = [];
        
            for (const message of messages) {
                const { assignMembers } = await assignUsersToSection(message.reportId, message.kpiName[0], message.code);
                const users = assignMembers.map(member => member.toString());
        
                if (users && users.includes(userId)) {
                    filteredMessages.push(message);
                } else {
                    console.log(`User ${userId} is not assigned to message ${message._id}`);
                }
            }
        
            messages = filteredMessages;
        }

        messages.sort((a, b) => b.createdAt - a.createdAt);
        return {
            success: true,
            data:{messages: messages.map(messageResponse),totalUnReadMessages}

        };

    } catch (error) {
        throw error;
    }
}