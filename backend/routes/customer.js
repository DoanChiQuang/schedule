import express from 'express';
import func from '../controllers/customer/index.js';

const router = express.Router();
router.post("/get-all",          func.getAll);
router.post("/create",           func.create);
router.post("/update",           func.update);
router.post("/delete",           func.remove);

export default router;