import express from 'express';
import func from '../controllers/yard/index.js';

const router = express.Router();
router.post("/get-all",          func.getAll);
router.post("/create",           func.create);
router.post("/delete",           func.remove);

export default router;