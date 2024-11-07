import express from 'express';
import {
    forgotPassword,
    resetPassword,
    signin,
    signup,
} from '../controllers/auth/index.js';

const router = express.Router();
router.post('/signin', signin);
router.post('/signup', signup);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
