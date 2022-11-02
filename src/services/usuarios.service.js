import { usuariosDao } from "../daos/index.js";

async function getAll(findObj, sortObj) {
  return await usuariosDao.getAll(findObj, sortObj);
}

async function getById(id) {
  return await usuariosDao.getById(id);
}

async function save(newData) {
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
