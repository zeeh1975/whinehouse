import { productosDao } from "../daos/index.js";
import { validUrlRegex } from "../const.js";

function validaProducto(producto) {
  // validacion de nombre
  let validacion = validateTextField(producto, "nombre");
  if (validacion != "") {
    return validacion;
  }
  // validacion de descripcion
  validacion = validateTextField(producto, "descripcion");
  if (validacion != "") {
    return validacion;
  }
  // validacion de codigo
  validacion = validateTextField(producto, "codigo");
  if (validacion != "") {
    return validacion;
  }
  // validaciones de foto
  validacion = validateTextField(producto, "foto");
  if (validacion != "") {
    return validacion;
  }
  if (!validUrlRegex.test(producto.foto)) {
    return "La clave foto no contiene una URL valida";
  }

  // validaciones de precio
  validacion = validateNumericField(producto, "precio");
  if (validacion != "") {
    return validacion;
  }
  if (producto.precio <= 0) {
    return "El precio debe ser mayor a cero";
  }
  // validaciones de stock
  validacion = validateNumericField(producto, "stock");
  if (validacion != "") {
    return validacion;
  }
  if (producto.stock < 0) {
    return "El stock no puede ser menor que cero";
  }
  return "";
}

const validateTextField = (object, field) => {
  if (!object.hasOwnProperty(field)) {
    return `El objecto no tiene una clave '${field}'`;
  }
  if (typeof object[field] !== "string") {
    return `La clave '${field}' debe ser texto`;
  }
  if (object[field].trim() == "") {
    return `La clave '${field}' no puede estar vacía`;
  }
  return "";
};

const validateNumericField = (object, field) => {
  if (!object.hasOwnProperty(field)) {
    return `El objecto no tiene una clave '${field}'`;
  }
  if (isNaN(object[field])) {
    return `La clave '${field}' debe ser un nuemro`;
  }
  return "";
};

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
