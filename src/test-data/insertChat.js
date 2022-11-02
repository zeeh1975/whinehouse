import { faker } from "@faker-js/faker";
import moment from "moment";
import { usuariosService, chatService } from "../services/index.js";
import { usuariosDao, chatDao } from "../daos/index.js";
import random from "random";
faker.locale = "es";

async function insertChat() {
  const users = await usuariosService.getAll({ isAdmin: false });
  for (let i = 0; i < users.length - 1; i++) {
    const user = users[i];
    const ahora = moment();
    ahora.subtract(90 + random.integer(30, 60), "minutes");
    const msgsCount = random.integer(5, 10);
    for (let j = 0; j < msgsCount - 1; j++) {
      const message = {
        usuario: user.id,
        timestamp: ahora.format("x"),
        tipo: "usuario",
        mensaje: faker.lorem.sentences(),
        leido: false,
      };
      await chatService.save(message);
      ahora.add(random.int(2, 5), "minutes");
    }
  }
  await usuariosDao.disconnect();
  await chatDao.disconnect();
}

insertChat();
