import express from 'express';
import func from '../controllers/time/index.js';

const router = express.Router();
router.post("/get-all",          func.getAll);
router.post("/create",           func.create);

export default router;