import fs from "fs";
import path from "path";
import {
  MESSAGE_OK,
  HTTP_STATUS_OK,
  HTTP_STATUS_ERROR_BAD_REQUEST,
  HTTP_STATUS_ERROR_UNAUTHORIZED,
} from "../const.js";
import logger from "../lib/logger.js";
import { getRootDir, WSResponse, WSErrorResponse, parceError } from "../lib/util.js";

const postLogin = async (req, res) => {
  res.status(HTTP_STATUS_OK).send(new WSResponse({ redirUrl: req.user.redirUrl }, MESSAGE_OK));
  req.user.redirUrl = "";
};

const postLoginFailed = async (req, res) => {
  const message = req.session.messages[req.session.messages.length - 1];
  res
    .status(HTTP_STATUS_ERROR_UNAUTHORIZED)
    .send(new WSErrorResponse(message, HTTP_STATUS_ERROR_UNAUTHORIZED));
};

const getLoginPage = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      res.redirect("/");
    } else {
      res.sendFile(path.join(getRootDir(), "./private/login.html"));
    }
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const logoutPage =
  fs.readFileSync(path.join(getRootDir(), "./public/assets/views/logout.hbs")) + "";

const getLogoutPage = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const user = await req.user;
      const usuario = user.nombreApellido;
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.baseUrl = "/";
        res.status(HTTP_STATUS_OK).send(logoutPage.replace("{{{body}}}", "Hasta luego " + usuario));
      });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    logger.error(error.message);
    res.redirect("/");
  }
};

const postSignup = async (req, res) => {
  res.redirect("/");
};

const getSignupPage = async (req, res) => {
  try {
    res.sendFile(path.join(getRootDir(), "./private/signup.html"));
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const postSignupFailed = async (req, res) => {
  const message = req.session.messages[req.session.messages.length - 1];
  res
    .status(HTTP_STATUS_ERROR_BAD_REQUEST)
    .send(new WSErrorResponse(message, HTTP_STATUS_ERROR_BAD_REQUEST));
};

export default {
  postLogin,
  postLoginFailed,
  getLoginPage,
  getLogoutPage,
  postSignup,
  postSignupFailed,
  getSignupPage,
};
