import express from 'express';
import func from '../controllers/yard/index.js';

const router = express.Router();
router.get("/get-all",          func.getAll);
router.post("/create",           func.create);
router.get("/delete",           func.remove);

export default router;