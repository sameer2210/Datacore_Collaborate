import { validateToken } from "../models/auth/service.js";
import { forgotPasswordJwtKey } from "../config/config.js";
import jwt from "jsonwebtoken";

const authenticated = async (req, res, next) => {
    try {

        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, forgotPasswordJwtKey);
        req.user = decode;
        next();

    } catch (error) {
        res.status(401).json({ message: error.message });
    }

};

export default authenticated;