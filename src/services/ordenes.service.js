import { ordenesDao } from "../daos/index.js";

async function getAll(findObj, sortObj) {
  return await ordenesDao.getAll(findObj, sortObj);
}

async function getById(id) {
  return await ordenesDao.getById(id);
}

async function save(newData) {
  return await ordenesDao.save(newData);
}

async function updateById(id, newData) {
  return await ordenesDao.updateById(id, newData);
}

async function deleteById(id) {
  return await ordenesDao.deleteById(id);
}

async function find(query) {
  return await ordenesDao.find(query);
}

export default {
  getAll,
  getById,
  save,
  updateById,
  deleteById,
  find,
};
