import { productosDao } from "../daos/index.js";
import { validUrlRegex } from "../const.js";
import { validateTextField, validateNumericField } from "../lib/validator.js";

function validaProducto(producto) {
  let validacion = validateTextField(producto, "nombre");
  if (validacion != "") {
    return validacion;
  }

  validacion = validateTextField(producto, "descripcion");
  if (validacion != "") {
    return validacion;
  }

  validacion = validateTextField(producto, "codigo");
  if (validacion != "") {
    return validacion;
  }

  validacion = validateTextField(producto, "categoria");
  if (validacion != "") {
    return validacion;
  }

  validacion = validateTextField(producto, "foto");
  if (validacion != "") {
    return validacion;
  }
  if (!validUrlRegex.test(producto.foto)) {
    return "La clave foto no contiene una URL valida";
  }

  validacion = validateNumericField(producto, "precio");
  if (validacion != "") {
    return validacion;
  }
  if (producto.precio <= 0) {
    return "El precio debe ser mayor a cero";
  }

  validacion = validateNumericField(producto, "stock");
  if (validacion != "") {
    return validacion;
  }
  if (producto.stock < 0) {
    return "El stock no puede ser menor que cero";
  }
  return "";
}

async function getAll(findObj, sortObj) {
  return await productosDao.getAll(findObj, sortObj);
}

async function getById(id) {
  return await productosDao.getById(id);
}

async function save(newData) {
  const validacion = validaProducto(newData);
  if (validacion != "") throw validacion;
  return await productosDao.save(newData);
}

async function updateById(id, newData) {
  const validacion = validaProducto(newData);
  if (validacion != "") throw validacion;
  return await productosDao.updateById(id, newData);
}

async function deleteById(id) {
  return await productosDao.deleteById(id);
}

export default { getAll, getById, save, updateById, deleteById };
