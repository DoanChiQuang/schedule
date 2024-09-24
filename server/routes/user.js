import express from 'express';
import func from '../controllers/user/index.js';

const router = express.Router();
router.post("/get-all",          func.getAll);
router.post("/create",           func.create);
router.post("/update",           func.update);
router.post("/delete",           func.remove);
router.post("/enable",           func.enable);
router.post("/reset-pass",           func.changePass);
router.post("/set-permission",           func.setPermission);

export default router;