import { usuariosDao } from "../daos/index.js";
import { validateTextField, validateNumericField, complexPassword } from "../lib/validator.js";
import { validEmailRegex } from "../const.js";
import config from "../config.js";

function validaUsuario(usuario) {
  let validacion = validateTextField(usuario, "nombreApellido");
  if (validacion != "") {
    return validacion;
  }

  validacion = validateTextField(usuario, "direccion");
  if (validacion != "") {
    return validacion;
  }

  validacion = validateTextField(usuario, "email");
  if (validacion != "") {
    return validacion;
  }
  if (!validEmailRegex.test(usuario.email)) {
    return "El email no es valido.";
  }

  validacion = validateNumericField(usuario, "edad");
  if (validacion != "") {
    return validacion;
  }

  validacion = validateTextField(usuario, "telefono");
  if (validacion != "") {
    return validacion;
  }

  validacion = validateTextField(usuario, "password");
  if (validacion != "") {
    return validacion;
  }
  // si es el entorno productivo exigir password complejas
  if (config.entorno === "production") {
    if (!complexPassword(usuario.password, 10, true, true, true, true)) {
      return "La contraseña debe tener al menos 10 caracteres, una mayuscula, una minuscula, un numero y un caracter especial.";
    }
  }

  validacion = validateTextField(usuario, "avatar");
  if (validacion != "") {
    return validacion;
  }
  return "";
}

async function getAll(findObj, sortObj) {
  return await usuariosDao.getAll(findObj, sortObj);
}

async function getById(id) {
  return await usuariosDao.getById(id);
}

async function save(newData) {
  const validacion = validaProducto(newData);
  if (validacion != "") throw validacion;
  return await usuariosDao.save(newData);
}

async function updateById(id, newData) {
  return await usuariosDao.updateById(id, newData);
}

async function deleteById(id) {
  return await usuariosDao.deleteById(id);
}

async function find(query) {
  return await usuariosDao.find(query);
}

export default {
  getAll,
  getById,
  save,
  updateById,
  deleteById,
  find,
};
