import express from 'express';
import { signIn } from '../controllers/auth/sign-in.js';
import { forgotPassword } from '../controllers/auth/forgot-password.js';
import { resetPassword } from '../controllers/auth/reset-password.js';
import { authenticated } from '../controllers/auth/authenticated.js';

const router = express.Router();
router.post('/signin', signIn);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/authenticated', authenticated);

export default router;
