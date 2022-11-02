import express from "express";
import compression from "compression";
import { Server as HttpServer } from "http";
import { Server as Socket } from "socket.io";
import os from "os";

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

// configuracion del servidor
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuracion de compresion
// threshold: indica tamaño minimo a comprimir
// level: nivel de compresion 0 mimimo 9 maximo
// filter: funcion que indica si la petición tiene que comprimirse o no
app.use(compression({ threshold: 0, level: 9, filter: () => true }));

const numCPUs = os.cpus().length;

export { app, io, httpServer, numCPUs };
