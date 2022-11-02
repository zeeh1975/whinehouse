import { Router } from "express";
import { ordenesController } from "../controllers/index.js";
import { webAuth } from "../middleware/session.js";
const router = Router();

router.route("/").get(webAuth, ordenesController.getOrders);

export default router;
