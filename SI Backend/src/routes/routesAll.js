import express from "express";
import dataEntry from '../models/dataEntry/routes.js';
import cra  from './cra.js'
import authAdmin from './auth.js'
import adminRoutes from './adminRotes.js'
const router = express.Router();

router.get('/logout', (req, res) => {
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'None' }); // Clear the cookie
        res.status(200).json({ message: 'Logged out successfully' });
    });
router.use("/cra",cra);
router.use('/',dataEntry)
router.use("/auth",authAdmin)
router.use('/admin',adminRoutes)

export default router;