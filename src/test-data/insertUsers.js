import { usuariosService } from "../services/index.js";
import { createHash } from "../middleware/passport.js";
import { faker } from "@faker-js/faker";
import { usuariosDao } from "../daos/index.js";
import random from "random";
faker.locale = "es";

async function insertUsers(cantUsers) {
  for (let i = 0; i < cantUsers - 1; i++) {
    const newUser = {
      nombreApellido: faker.name.fullName(),
      direccion: faker.address.streetAddress(true),
      email: faker.internet.email(),
      edad: random.int(18, 90),
      telefono: faker.phone.number("+540##########"),
      password: createHash("1234"),
      avatar: "none.jpg",
      isAdmin: false,
    };
    await usuariosService.save(newUser);
  }
  console.log("Se insertaron " + cantUsers + " usuarios");
  await usuariosDao.disconnect();
}

insertUsers(10);
