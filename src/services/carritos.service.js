import { carritosDao } from "../daos/index.js";

async function getAll(findObj, sortObj) {
  return await carritosDao.getAll(findObj, sortObj);
}

async function getById(id) {
  return await carritosDao.getById(id);
}

async function save(newData) {
  return await carritosDao.save(newData);
}

async function updateById(id, newData) {
  return await carritosDao.updateById(id, newData);
}

async function deleteById(id) {
  return await carritosDao.deleteById(id);
}

async function find(query) {
  return await carritosDao.find(query);
}

export default {
  getAll,
  getById,
  save,
  updateById,
  deleteById,
  find,
};
