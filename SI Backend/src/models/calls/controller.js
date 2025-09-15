import { validateAndSanitizeBookCall, callResponseDto, validateCallDone } from './dto.js';
import { bookCall as bookCallService, getAllCalls as getAllCallsService, callsDone as callsDoneService, callComment as callCommentService } from './service.js';

export async function bookCall(req, res, next) {
    try {
        const { userId } = req.user;
        const data = validateAndSanitizeBookCall(req.body);
        data.user = userId;
        const call = await bookCallService(data);
        res.status(201).json(callResponseDto(call));
    } catch (error) {
        next(error);
    }
}



export async function getAllCalls(req, res, next) {
    try {
        const { status } = req.query;
        const allowedStatuses = ['pending', 'completed', 'cancelled'];


        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const calls = await getAllCallsService({ status });
        res.status(200).json(calls);
    } catch (error) {
        console.log(error);
        next(error);
    }
}


export async function callDones(req, res, next) {
    try {

        const data = validateCallDone(req.body);

        const response = await callsDoneService(data);

        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}

export async function addCallComment(req, res, next) {
    try {
        const { id } = req.params
        const { comment } = req.body;
        const response = await callCommentService({ id, comment });
        res.status(200).json(response);

    } catch (error) {
        next(error);
    }
}


