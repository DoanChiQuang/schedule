import express from 'express';
import func from '../controllers/time/index.js';

const router = express.Router();
router.post("/get-all",          func.getAll);
router.post("/create",           func.create);
router.post("/update",           func.update);
router.post("/get-all-time-detail", func.getAllTimeDetail);

export default router;