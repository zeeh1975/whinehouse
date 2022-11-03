import { Router } from "express";
import routerProductos from "./productos.route.js";
import routerCarritos from "./carritos.route.js";
import routerUsuario from "./usuarios.route.js";
import routerChat from "./chat.route.js";
import routerOrdenes from "./ordenes.route.js";
import { apiAuth } from "../middleware/session.js";

const router = Router();

router.use("/productos", apiAuth, routerProductos);
router.use("/carrito", apiAuth, routerCarritos);
router.use("/usuario", routerUsuario);
router.use("/chat", routerChat);
router.use("/ordenes", routerOrdenes);

export default router;
