import { validateUserType as validateUserService } from "../models/user/service.js";
import mongoose from 'mongoose'; // Import mongoose for ObjectId


export const UserTypes = {
    DUMMY: 'dummy',
    COMPLETED: 'completed',
};

const validateUserType = (userType) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const data = { _id: new mongoose.Types.ObjectId(userId), isDummy: false };

            if (userType === UserTypes.DUMMY) {
                data.isDummy = true;
            }


            const response = await validateUserService(data);

            if (response.validate) {
                next();
            } else {
                res.status(401).json({ message: "Invalid user" });
            }
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: "Invalid user" });
        }
    };
};

export default validateUserType;
