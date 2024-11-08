import express from 'express';
import { signin } from '../controllers/auth/signin.js';
import { signup } from '../controllers/auth/signup.js';
import { forgotPassword } from '../controllers/auth/forgotPassword.js';
import { resetPassword } from '../controllers/auth/resetPassword.js';
import { authenticated } from '../controllers/auth/authenticated.js';

const router = express.Router();
router.post('/signin', signin);
router.post('/signup', signup);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/authenticated', authenticated);

export default router;
