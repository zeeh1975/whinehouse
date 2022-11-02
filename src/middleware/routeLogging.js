import logger from "../lib/logger.js";

function routeLog(req, res, next) {
  logger.info(req.method + " " + req.url);
  next();
}

function errorRouteLog(req, res, next) {
  logger.warn("Ruta no valida: " + req.method + " " + req.originalUrl);
  next();
}

export { routeLog, errorRouteLog };
