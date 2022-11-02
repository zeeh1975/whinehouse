import sizeOf from "image-size";
import util from "util";
import fs from "fs";
import path from "path";
import moment from "moment";

moment.locale("ES");

function cloneObj(objeto) {
  return JSON.parse(JSON.stringify(objeto));
}

function printObj(objeto) {
  console.log(util.inspect(objeto, false, 12, true));
}

function validImageFile(img) {
  let result = false;
  try {
    const dimensions = sizeOf(img);
    result = true;
  } catch (error) {}
  return result;
}

function deleteFile(filename) {
  fs.unlink(filename, (err) => {
    if (err) {
      throw err;
    }
  });
}

function parceError(error) {
  if (error.message) {
    error = error.message;
  }
  return error;
}

class WSResponse {
  constructor(data, message, error, errorCode) {
    this.data = data;
    this.message = message || "";
    this.error = error || false;
    this.errorCode = errorCode || 0;
  }
}

class WSErrorResponse extends WSResponse {
  constructor(message, errorCode) {
    super();
    this.data = null;
    this.message = message || "";
    this.error = true;
    this.errorCode = errorCode;
  }
}

let rootDir = null;

function getRootDir() {
  if (!rootDir) {
    const startdir = process.argv[1];
    let root = startdir;
    let prevroot;
    let found = false;
    while (true) {
      const pj = path.join(root, "package.json");
      if (fs.existsSync(pj)) {
        found = true;
        break;
      }
      prevroot = root;
      root = path.join(root, "..");
      if (prevroot === root) break;
    }
    if (found) {
      rootDir = root;
    } else {
      rootDir = startdir;
    }
  }
  return rootDir;
}

function cleanMessages(msgs) {
  return msgs.map((v) => {
    const date = moment(parseInt(v.timestamp)).format("YYYY-MM-DD HH:mm:ss");
    let isSupportResponse = false;
    if (v.tipo != "usuario") isSupportResponse = true;
    return { timestamp: date, isSupportResponse, mensaje: v.mensaje };
  });
}

export {
  WSResponse,
  WSErrorResponse,
  parceError,
  cloneObj,
  printObj,
  sizeOf,
  validImageFile,
  deleteFile,
  getRootDir,
  cleanMessages,
};
