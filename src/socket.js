import { chatService } from "./services/index.js";
import logger from "./lib/logger.js";
import { io } from "./global.js";
import { sessionMiddleware } from "./middleware/session.js";
import { cleanMessages } from "./lib/util.js";

const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));

io.use((socket, next) => {
  const session = socket.request.session;
  if (session && session.passport.user) {
    next();
  } else {
    next(new Error("Unauthorized"));
  }
});

function socketConfig() {
  io.on("connection", async (socket) => {
    //console.log("connection=" + socket.id);
    // const session = socket.request.session;
    // const channel = "mensajes_" + session.passport.user;
    //console.log("*" + channel + "*");

    socket.on("mensajes", async (mensaje) => {
      const session = socket.request.session;
      const chatMessages = cleanMessages(
        await chatService.getAll({ usuario: session.passport.user })
      );
      const channel = "mensajes_" + session.passport.user;
      // console.log("*" + channel + "*");
      socket.emit(channel, chatMessages);
    });
    socket.on("mensaje", async (mensaje) => {
      const session = socket.request.session;
      try {
        await chatService.save({
          usuario: session.passport.user,
          tipo: "usuario",
          mensaje: mensaje.text,
          leido: false,
        });
      } catch (error) {
        logger.error("Error guardando mensaje de chat=", error);
      }
      let chatMessages = cleanMessages(
        await chatService.getAll({ usuario: session.passport.user })
      );
      const channel = "mensajes_" + session.passport.user;
      // console.log("*" + channel + "*");
      io.sockets.emit(channel, chatMessages);
    });
  });
}

export { socketConfig };
