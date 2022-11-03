import { Router } from "express";
import { webController } from "../controllers/index.js";
import { webAuth, isAdmin } from "../middleware/session.js";

const router = Router();

router.route("/products").get(webAuth, webController.getProductosPage);
router.route("/profile").get(webAuth, webController.getProfilePage);
router.route("/cart").get(webAuth, webController.getCartPage);
router.route("/chat").get(webAuth, webController.getChatPage);
router.route("/chat/:usuario").get(isAdmin, webController.getChatPage);
router.route("/serverconfig").get(isAdmin, webController.getConfigPage);
router.route("/serverparams").get(isAdmin, webController.getConfigParamsPage);
router.route("/geterror500").get(webController.getError500);
//router.route("/test").get(webController.test);

export default router;
