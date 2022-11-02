import config from "../config.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { HTTP_STATUS_ERROR_UNAUTHORIZED, MESSAGE_UNAUTHORIZED_RESOURCE } from "../const.js";
import { app } from "../global.js";
import { WSErrorResponse } from "../lib/util.js";

function webAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    if (req.url != "/favicon.ico") {
      req.session.redirUrl = req.url;
    } else {
      req.session.redirUrl = "";
    }
    res.redirect("/login");
  }
}

function apiAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(HTTP_STATUS_ERROR_UNAUTHORIZED)
      .send(new WSErrorResponse(MESSAGE_UNAUTHORIZED_RESOURCE, HTTP_STATUS_ERROR_UNAUTHORIZED));
  }
}

const sessionMiddleware = session({
  store: MongoStore.create({
    mongoUrl: config.mongoDBURL,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
  }),
  secret: config.sessionSecret || "secret1234",
  resave: false,
  saveUninitialized: false,
  rolling: true, // para hacer que la sesion se refresque con cada petición
  cookie: {
    secure: false, // if true only transmit cookie over https
    httpOnly: false, // if true prevent client side JS from reading the cookie
    maxAge: +config.sessionMaxAge || 1000 * 60 * 10, // session max age in miliseconds
  },
});

function sessionConfig() {
  // configuracion de la sesion en mongo atlas
  app.use(sessionMiddleware);
}

function unauthorized(res) {
  res
    .status(HTTP_STATUS_ERROR_UNAUTHORIZED)
    .send(
      new WSErrorResponse(
        `No tiene permiso para realizar la operacion (${req.method}:${req.originalUrl})`,
        HTTP_STATUS_ERROR_UNAUTHORIZED
      )
    );
}

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      next();
    } else {
      unauthorized(res);
    }
  } else {
    unauthorized(res);
  }
};

export { webAuth, apiAuth, sessionConfig, isAdmin, sessionMiddleware };
