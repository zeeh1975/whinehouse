import config from "./config.js";
import cluster from "cluster";
import express from "express";
import path from "path";
import logger from "./lib/logger.js";
import router from "./routes/index.js";
import { routeLog } from "./middleware/routeLogging.js";
import { sessionConfig } from "./middleware/session.js";
import { app, httpServer, numCPUs } from "./global.js";
import { passportConfig } from "./middleware/passport.js";
import { getRootDir } from "./lib/util.js";
import { socketConfig } from "./socket.js";

// configuracion de la sesion usando mongo como persistencia
sessionConfig();

// configuracion passport
passportConfig();

// log de requerimientos
app.use(routeLog);

// contenido estatico
app.use(express.static(path.join(getRootDir(), "./public")));
app.use(express.static(path.join(getRootDir(), "./uploads")));

// rutas
app.use("/", router);

socketConfig();

// creo el servidor de Express en el puerto indicado
if (config.serverMode != "CLUSTER") {
  const server = httpServer.listen(config.serverPort, () => {
    logger.info(`Servidor fork escuchando en el puerto ${server.address().port}`);
  });
  // loguear cualquier error a consola
  server.on("error", (error) => logger.error(`Error en servidor ${error}`));
} else {
  // mode cluster
  if (cluster.isPrimary) {
    // master
    logger.info(`Servidor primario PID ${process.pid}`);
    logger.info(`Lanzando ${numCPUs} workers `);
    for (let i = 0; i < numCPUs; i++) {
      logger.info(`Lanzando worker ${i + 1}`);
      cluster.fork();
    }
    cluster.on("exit", (worker, Code, signal) => {
      logger.info(`Worker ${worker.process.pid} finalizado`);
    });
  } else {
    // fork
    const server = httpServer.listen(config.serverPort, () => {
      logger.info(`Worker escuchando en el puerto ${server.address().port} PID ${process.pid}`);
    });
    server.on("error", (error) => logger.error(`Error en servidor ${error}`));
    process.on("exit", (code) => {
      logger.info(`Exit code ${code} PID ${process.pid}`);
    });
  }
}
