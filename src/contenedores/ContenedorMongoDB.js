import mongoose from "mongoose";
import { cloneObj } from "../lib/util.js";
import { connect, formatItem, isValidObjectId } from "../lib/mongoUtil.js";

class ContenedorMongoDB {
  constructor(MongoURL, model) {
    this.model = model;
    connect(mongoose, MongoURL);
  }

  async save(newItem) {
    if (!newItem.timestamp) {
      newItem.timestamp = +new Date();
    }
    const saveModel = new this.model(newItem);
    const savedItem = await saveModel.save();
    return savedItem.id;
  }

  async getById(idBuscado) {
    if (isValidObjectId(idBuscado)) {
      return formatItem(cloneObj(await this.model.findById(idBuscado)));
    }
    return null;
  }

  async find(findObj) {
    const result = await this.model.find(findObj);
    if (result.length > 0) {
      return formatItem(cloneObj(result[0]));
    }
    return null;
  }

  async getAll(findObj, sortObj) {
    let result = await this.model.find(findObj).sort(sortObj);
    const list = cloneObj(result);
    list.map((element) => {
      return formatItem(element);
    });
    return list;
  }

  async deleteById(idBuscado) {
    if (isValidObjectId(idBuscado)) {
      let item = await this.model.findById(idBuscado);
      if (item) {
        item = formatItem(cloneObj(item));
        await this.model.deleteOne({ _id: item.id });
        return item;
      }
    }
    return null;
  }

  async deleteAll() {
    await this.model.deleteMany({});
  }

  async updateById(idBuscado, itemActualizado) {
    if (isValidObjectId(idBuscado)) {
      const item = await this.model.findById(idBuscado);
      if (item) {
        delete itemActualizado.id;
        delete itemActualizado.__v;
        delete itemActualizado._id;
        await this.model.updateOne({ _id: idBuscado }, { $set: itemActualizado });
        const item = await this.model.findById(idBuscado);
        return item;
      }
    }
    return null;
  }

  async update(findObj, updateObj) {
    return await this.model.updateMany(findObj, updateObj);
  }

  async disconnect() {
    await mongoose.disconnect();
  }
}

export default ContenedorMongoDB;
