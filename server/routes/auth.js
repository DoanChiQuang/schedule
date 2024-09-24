import express from 'express';
import func from '../controllers/auth/index.js';

const router = express.Router();
router.post("/signin",          func.signin);
router.post("/signup",          func.signup);
// router.post("/forgotpassword",  func.forgotpassword);
// router.get("/logout",           func.logOut);

export default router;