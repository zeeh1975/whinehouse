import { usuariosDao } from "../daos/index.js";
import { createHash } from "../middleware/passport.js";

const email = "admin@winehouse.com";
let newUser = {
  nombreApellido: "Sys admin",
  direccion: "N/A",
  email,
  edad: 0,
  telefono: "0000000000",
  password: createHash("1234"),
  avatar: "none",
  isAdmin: true,
};

async function insertAdmin() {
  const usr = await usuariosDao.find({ email });
  if (usr) {
    await usuariosDao.deleteById(usr.id);
  }
  console.log(await usuariosDao.save(newUser));
  await usuariosDao.disconnect();
  console.log("Administrador creado");
}

insertAdmin();
