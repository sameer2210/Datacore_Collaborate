import { validateUserType as validateUserService } from "../models/user/service.js";
import mongoose from 'mongoose'; // Import mongoose for ObjectId


export const Roles = {
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin', // Corrected typo from 'supper_admin' to 'super_admin'
};

const validateRole = (roles) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const data = { _id: new mongoose.Types.ObjectId(userId), isDummy: false };

            if (roles) {
                data.role = { $in: roles };
            }


            const response = await validateUserService(data);

            if (response.validate) {
                next();
            } else {
                res.status(401).json({ message: "Unauthorized" }); // Added a message for unauthorized access
            }
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: "Invalid user" });
        }
    };
};

export default validateRole; // Corrected export to validateRole
