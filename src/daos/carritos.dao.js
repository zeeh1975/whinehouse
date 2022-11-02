import ContenedorMongoDB from "../contenedores/ContenedorMongoDB.js";
import config from "../config.js";
import model from "../models/carritos.model.js";

class CarritosDAOMongoDB extends ContenedorMongoDB {
  constructor() {
    super(config.mongoDBURL, model);
  }
}

let carritosDao = new CarritosDAOMongoDB();

export default carritosDao;
