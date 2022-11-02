import fs from "fs";
import path from "path";
import pug from "pug";
import handlebars from "handlebars";
import logger from "../lib/logger.js";
import config from "../config.js";
import { HTTP_STATUS_ERROR_BAD_REQUEST } from "../const.js";
import { getRootDir, WSErrorResponse, parceError } from "../lib/util.js";

const compiledInfoPage = pug.compileFile(path.join(getRootDir(), "./src/views/infoPage.pug"));
const configPage = fs.readFileSync(path.join(getRootDir(), "./src/views/configPage.hbs")) + "";

const getProductosPage = async (req, res) => {
  try {
    res.sendFile(path.join(getRootDir(), "./private/productos.html"));
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const getCartPage = async (req, res) => {
  try {
    res.sendFile(path.join(getRootDir(), "./private/cart.html"));
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const getProfilePage = async (req, res) => {
  try {
    res.sendFile(path.join(getRootDir(), "./private/profile.html"));
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const getConfigPage = async (req, res) => {
  try {
    const infoPage = {
      entorno: config.entorno,
      execPath: process.execPath,
      platform: process.platform,
      processId: process.pid,
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage().rss / 1024,
      numCPUs: config.numCPUs,
    };
    res.send(compiledInfoPage({ infoPage }));
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const getError500 = async (req, res, next) => {
  next(new Error("Este error no esta manejado"));
};

const getConfigParamsPage = async (req, res) => {
  try {
    const compiledConfigPage = handlebars.compile(configPage);
    res.send(compiledConfigPage({ config }));
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const getChatPage = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const usuario = req.params.usuario;
      if (usuario) {
        res.sendFile(path.join(getRootDir(), "./private/ver_chat_soporte.html"));
      } else {
        res.sendFile(path.join(getRootDir(), "./private/chat_soporte.html"));
      }
    } else {
      res.sendFile(path.join(getRootDir(), "./private/chat.html"));
    }
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

// const test = async (req, res) => {
//   try {
//     await ordenesService.save({ usuario: "1234", productos: [] });
//     res.send("ok");
//   } catch (error) {
//     error = parceError(error);
//     logger.error(error);
//     res
//       .status(HTTP_STATUS_ERROR_BAD_REQUEST)
//       .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
//   }
// };

export default {
  getProductosPage,
  getProfilePage,
  getCartPage,
  getChatPage,
  getConfigPage,
  getError500,
  getConfigParamsPage,
  //test,
};
