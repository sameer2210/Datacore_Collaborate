import Call from './model.js';
import { callResponseDto } from "./dto.js";
import { sendCallEmailTOSITeam } from "../../util/sendgrid.js";


export async function bookCall(callData) {
    const call = new Call(callData);
    await call.save();
    const callRecord = await Call.findById(call._id)
        .populate('user')
        .populate({
            path: 'user',
            populate: {
                path: 'organization'
            }
        });



    await sendCallEmailTOSITeam({ date: callRecord.date, time: callRecord.time, companyName: callRecord.user.organization.name || "", adminName: callRecord.name, email: callRecord.email, phoneNumber: callRecord.phone });

    return call;
}

export async function getAllCalls({ status }) {
    const query = status ? { status } : {};
    const calls = await Call.find(query)
        .populate('user')
        .populate({
            path: 'user',
            populate: {
                path: 'organization'
            }
        });
    return calls.map(call => callResponseDto(call));
}

export async function callsDone({ calls }) {
    if (!Array.isArray(calls)) {
        throw new Error('Calls must be an array');
    }

    await Call.updateMany(
        { _id: { $in: calls } },
        { $set: { status: 'completed', completedAt: new Date() } }
    );

    return { message: 'Calls status updated to completed' };
}

export async function callComment({ id, comment }) {
    if (!id || !comment) {
        throw new Error('Both id and comment are required');
    }

    const call = await Call.findByIdAndUpdate(
        id,
        { $set: { comment: comment } },
        { new: true }
    );


    return { message: 'Call comment updated successfully', call: callResponseDto(call) };
}