import ContenedorMongoDB from "../contenedores/ContenedorMongoDB.js";
import config from "../config.js";
import model from "../models/usuarios.model.js";

class UsuariosDAOMongoDB extends ContenedorMongoDB {
  constructor() {
    super(config.mongoDBURL, model);
  }
}

const usuariosDao = new UsuariosDAOMongoDB();

export default usuariosDao;
