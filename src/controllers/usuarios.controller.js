import logger from "../lib/logger.js";
import {
  HTTP_STATUS_OK,
  HTTP_STATUS_ERROR_BAD_REQUEST,
  HTTP_STATUS_ERROR_UNAUTHORIZED,
  MESSAGE_UNAUTHORIZED_RESOURCE,
  MESSAGE_OK,
} from "../const.js";
import { WSResponse, WSErrorResponse, parceError } from "../lib/util.js";
import { usuariosService } from "../services/index.js";

const getInfoUsuario = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      res.status(HTTP_STATUS_OK).send(
        new WSResponse(
          {
            id: req.user.id,
            usuario: req.user.nombreApellido,
            email: req.user.email,
            isAdmin: !!req.user.isAdmin,
            carrito: req.user.carrito,
          },
          MESSAGE_OK
        )
      );
    } else {
      res
        .status(HTTP_STATUS_OK)
        .send(
          new WSResponse(
            { id: null, usuario: null, email: null, isAdmin: false, carrito: null },
            MESSAGE_OK
          )
        );
    }
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const getProfileUsuario = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      res.send(
        new WSResponse(
          {
            nombreApellido: req.user.nombreApellido,
            direccion: req.user.direccion,
            email: req.user.email,
            edad: req.user.edad,
            telefono: req.user.telefono,
            avatar: req.user.avatar,
          },
          MESSAGE_OK
        )
      );
    } else {
      res.send(
        new WSResponse(
          {
            nombreApellido: null,
            direccion: null,
            email: null,
            edad: null,
            telefono: null,
            avatar: null,
          },
          MESSAGE_OK
        )
      );
    }
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const getUser = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const userId = req.session.passport.user;
      const user = await usuariosService.getById(userId);
      res.status(HTTP_STATUS_OK).send(new WSResponse({ usuario: user.username }, MESSAGE_OK));
    } else {
      res
        .status(HTTP_STATUS_ERROR_UNAUTHORIZED)
        .send(new WSErrorResponse(MESSAGE_UNAUTHORIZED_RESOURCE, HTTP_STATUS_ERROR_UNAUTHORIZED));
    }
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

export default { getInfoUsuario, getProfileUsuario, getUser };
