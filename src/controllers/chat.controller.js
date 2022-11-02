import logger from "../lib/logger.js";
import { HTTP_STATUS_OK, HTTP_STATUS_ERROR_BAD_REQUEST, MESSAGE_OK } from "../const.js";
import { WSResponse, WSErrorResponse, parceError } from "../lib/util.js";
import { usuariosService, chatService } from "../services/index.js";
import { cleanMessages } from "../lib/util.js";
import { io } from "../global.js";

const getChat = async (req, res) => {
  try {
    const usuario = req.params.usuario;
    if (!usuario) {
      let allUsers = await usuariosService.getAll({ isAdmin: false });
      let noLeidos = await chatService.getAll({ leido: false });
      noLeidos = noLeidos.map((v) => v.usuario);
      noLeidos = [...new Set(noLeidos)];
      allUsers = allUsers.map((v) => {
        const idx = noLeidos.indexOf(v.id);
        const noLeido = idx != -1;
        return { id: v.id, email: v.email, nombreApellido: v.nombreApellido, noLeido };
      });
      allUsers = allUsers.sort((a, b) => {
        if (a.noLeido && !b.noLeido) {
          return -1;
        } else if (!a.noLeido && b.noLeido) {
          return 1;
        } else if (a.nombreApellido > b.nombreApellido) {
          return 1;
        } else if (a.nombreApellido < b.nombreApellido) {
          return -1;
        } else {
          return 0;
        }
      });
      res.status(HTTP_STATUS_OK).send(new WSResponse(allUsers, MESSAGE_OK));
    } else {
      const chatUsuario = await chatService.getAll({ usuario });
      const mensajes = cleanMessages(chatUsuario);
      const userData = await usuariosService.getById(usuario);
      res.status(HTTP_STATUS_OK).send(
        new WSResponse(
          {
            usuario: { nombreApellido: userData.nombreApellido, email: userData.email },
            mensajes,
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

const postChat = async (req, res) => {
  try {
    const mensaje = req.body;
    if (mensaje.text) {
      await chatService.save({
        usuario: mensaje.usuario,
        tipo: "soporte",
        mensaje: mensaje.text,
        leido: true,
      });
    }
    await chatService.markAsRead(mensaje.usuario);
    res.status(HTTP_STATUS_OK).send(new WSResponse({}, MESSAGE_OK));
    // socket.io al chat de cliente
    const channel = "mensajes_" + mensaje.usuario;
    const chatMessages = cleanMessages(await chatService.getAll({ usuario: mensaje.usuario }));
    io.sockets.emit(channel, chatMessages);
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

export default { getChat, postChat };
