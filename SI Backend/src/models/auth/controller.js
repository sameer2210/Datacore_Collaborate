import { login as loginService } from './service.js';
import { loginResponse, validateAndSanitizeLogin } from './dto.js';

export const login = async (req, res, next) => {
    try {
        const loginData = validateAndSanitizeLogin(req.body);
        const token = await loginService(loginData);
        return res.status(200).json(loginResponse(token));
    } catch (error) {
        next(error);
    }
}