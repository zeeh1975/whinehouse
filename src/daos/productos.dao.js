import ContenedorMongoDB from "../contenedores/ContenedorMongoDB.js";
import config from "../config.js";
import model from "../models/productos.model.js";

class ProductosDAOMongoDB extends ContenedorMongoDB {
  constructor() {
    super(config.mongoDBURL, model);
  }
}

let productosDao = new ProductosDAOMongoDB();

export default productosDao;
