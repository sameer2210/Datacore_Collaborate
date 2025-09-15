import { userResponseDto } from "../user/dto.js";
import { Types } from 'mongoose';

export const validateAndSanitizeBookCall = (data) => {
    const { name, email, phone, date, time } = data;

    if (!name || name.trim().length < 2 || name.trim().length > 50) {
        throw new Error('Name must be between 2 and 50 characters');
    }

    const sanitizedEmail = email.toLowerCase().trim();
    if (!sanitizedEmail.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
        throw new Error('Invalid email format');
    }

    if (!phone || !phone.match(/^(\+[1-9]\d{0,2}(\s)?)?[0-9]{1,14}$/)) {
        throw new Error('Invalid phone number format');
    }

    if (!date || !date.match(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/)) {
        throw new Error('Invalid date format. Use dd/mm/yyyy');
    }

    if (!time || !time.match(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)) {
        throw new Error('Invalid time format. Use HH:MM (24-hour)');
    }

    return {
        name: name.trim(),
        email: sanitizedEmail,
        phone,
        date,
        time
    };
};

export const callResponseDto = (data) => {
    const isMongoId = (value) => Types.ObjectId.isValid(value);

    return {
        id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: data.date,
        time: data.time,
        status: data.status,
        user: data.user && !isMongoId(data.user) && typeof data.user === 'object' ? userResponseDto(data.user) : data.user,
        createdAt: data.createdAt,
        completedAt: data.completedAt,
        comment: data.comment
    };
};


export const validateCallDone = (data) => {
    if (!Array.isArray(data.calls)) {
        throw new Error('Calls must be an array');
    }

    data.calls.forEach(callId => {
        if (!Types.ObjectId.isValid(callId)) {
            throw new Error(`Invalid MongoDB ID: ${callId}`);
        }
    });

    return { calls: data.calls };
}
