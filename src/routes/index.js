import { Router } from "express";
import routerWeb from "./web.route.js";
import routerSesiones from "./session.route.js";
import routerApi from "./api.route.js";
import { errorRouteLog } from "../middleware/routeLogging.js";
import { errorHandler, pageNotFound } from "../middleware/errorHandler.js";

const router = Router();

router.use("/api", routerApi);
router.use("/", routerSesiones);
router.use("/", routerWeb);
router.all("*", errorRouteLog, pageNotFound);
router.use(errorHandler);

export default router;
