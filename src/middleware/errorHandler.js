import ejs from "ejs";
import fs from "fs";
import path from "path";
import logger from "../lib/logger.js";
import { HTTP_STATUS_ERROR_NOT_FOUND, HTTP_STATUS_ERROR_INTERNAL_SERVER_ERROR } from "../const.js";
import { getRootDir, parceError } from "../lib/util.js";

const errorPage = fs.readFileSync(path.join(getRootDir(), "./src/views/errorPage.ejs")) + "";

// manejador de errores inesperados
function errorHandler(err, req, res, next) {
  const compiledErrorPage = ejs.compile(errorPage);
  err = parceError(err);
  logger.error("Error interno del servidor: " + err);
  const error = {
    code: HTTP_STATUS_ERROR_INTERNAL_SERVER_ERROR,
    message: err,
  };
  res.send(compiledErrorPage({ error }));
}

function pageNotFound(req, res) {
  res.status(HTTP_STATUS_ERROR_NOT_FOUND).sendFile(path.join(getRootDir(), "./private/404.html"));
}

export { errorHandler, pageNotFound };
