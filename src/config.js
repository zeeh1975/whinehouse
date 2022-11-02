import os from "os";
import dotenv from "dotenv";
let entorno = process.env.NODE_ENV || "development";
entorno = entorno.trim();
dotenv.config({ path: `.env.${entorno}` });

// MongoDB
const mongoDBURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}`;
const nodeMailerService = process.env.NODEMAILER_SERVICE;
const nodeMailerPort = process.env.NODEMAILER_PORT;
const nodeMailerUser = process.env.NODEMAILER_USER;
const nodeMailerPass = process.env.NODEMAILER_PASS;

const adminMail = process.env.ADMIN_MAIL;

const serverPort = process.env.PORT || 8080;
const serverMode = process.env.SERVER_MODE;

const sessionSecret = process.env.SESSION_SECRET;
const sessionMaxAge = process.env.SESSION_MAXAGE;

const numCPUs = os.cpus().length;

export default {
  entorno,
  mongoDBURL,
  nodeMailerService,
  nodeMailerPort,
  nodeMailerUser,
  nodeMailerPass,
  adminMail,
  serverPort,
  serverMode,
  sessionSecret,
  sessionMaxAge,
  numCPUs,
};
