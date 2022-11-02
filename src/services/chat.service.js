import { chatDao } from "../daos/index.js";

async function getAll(findObj, sortObj) {
  return await chatDao.getAll(findObj, sortObj);
}

async function getById(id) {
  return await chatDao.getById(id);
}

async function save(newData) {
  newData.estado = "generada";
  return await chatDao.save(newData);
}

async function updateById(id, newData) {
  return await chatDao.updateById(id, newData);
}

async function deleteById(id) {
  return await chatDao.deleteById(id);
}

async function find(query) {
  return await chatDao.find(query);
}

async function markAsRead(user) {
  return await chatDao.update({ usuario: user }, { $set: { leido: true } });
}

export default {
  getAll,
  getById,
  save,
  updateById,
  deleteById,
  find,
  markAsRead,
};
