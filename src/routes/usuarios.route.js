import { Router } from "express";
import { usuariosController } from "../controllers/index.js";
import { apiAuth } from "../middleware/session.js";
const router = Router();

router.route("/info").get(usuariosController.getInfoUsuario);
router.route("/profile").get(apiAuth, usuariosController.getProfileUsuario);

export default router;
