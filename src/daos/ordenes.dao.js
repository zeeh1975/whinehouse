import ContenedorMongoDB from "../contenedores/ContenedorMongoDB.js";
import config from "../config.js";
import model from "../models/ordenes.model.js";

class OrdenesDAOMongoDB extends ContenedorMongoDB {
  constructor() {
    super(config.mongoDBURL, model);
  }
}

let ordenesDao = new OrdenesDAOMongoDB();

export default ordenesDao;
