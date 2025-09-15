import { validateToken } from "../models/auth/service.js";
import { updateLastActive } from "../models/user/service.js";

const authenticated = async (req, res, next) => {
    try {

        const token = req.headers.authorization.split(' ')[1];
        const decode = await validateToken(token);
        const user = await updateLastActive(decode.userId);
        req.user = { ...decode, organization: user.organization?.id, role: user.role };
        next();

    } catch (error) {
        res.status(401).json({ message: error.message });
    }

};

export default authenticated;