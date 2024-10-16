import express from 'express';
import actions from '../controllers/auth/index.js';

const router = express.Router();
router.post('/signin', actions.signin);
router.post('/signup', actions.signup);

export default router;
