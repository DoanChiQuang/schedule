import express from 'express';
import func from '../controllers/bookingCalendar/index.js';

const router = express.Router();
router.post("/get-all",          func.getAll);
router.post("/create",           func.create);
router.post("/delete",           func.remove);
router.post("/export",           func.exportB);

export default router;