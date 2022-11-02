import { Router } from "express";
import { chatController } from "../controllers/index.js";
import { isAdmin } from "../middleware/session.js";
const router = Router();

router.route("/").get(isAdmin, chatController.getChat).post(isAdmin, chatController.postChat);
router.route("/:usuario").get(isAdmin, chatController.getChat);

export default router;
