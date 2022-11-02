import ContenedorMongoDB from "../contenedores/ContenedorMongoDB.js";
import config from "../config.js";
import model from "../models/chat.model.js";

class ChatDAOMongoDB extends ContenedorMongoDB {
  constructor() {
    super(config.mongoDBURL, model);
  }
}

let chatDao = new ChatDAOMongoDB();

export default chatDao;
