import { Router } from "express";
import routerProductos from "./productos.route.js";
import routerCarritos from "./carritos.route.js";
import routerWeb from "./web.route.js";
import routerUsuario from "./usuarios.route.js";
import routerChat from "./chat.route.js";
import routerOrdenes from "./ordenes.route.js";
import sessionRoutes from "./session.route.js";
import { apiAuth } from "../middleware/session.js";
import { errorRouteLog } from "../middleware/routeLogging.js";
import { errorHandler, pageNotFound } from "../middleware/errorHandler.js";

const router = Router();

router.use("/api/productos", apiAuth, routerProductos);
router.use("/api/carrito", apiAuth, routerCarritos);
router.use("/api/usuario", routerUsuario);
router.use("/api/chat", routerChat);
router.use("/api/ordenes", routerOrdenes);
router.use("/", sessionRoutes);
router.use("/", routerWeb);
router.all("*", errorRouteLog, pageNotFound);
router.use(errorHandler);

export default router;
