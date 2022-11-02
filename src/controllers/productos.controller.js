import logger from "../lib/logger.js";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
  HTTP_STATUS_ERROR_BAD_REQUEST,
  HTTP_STATUS_ERROR_NOT_FOUND,
  MESSAGE_PRODUCT_NOT_FOUND,
  MESSAGE_OK,
  MESSAGE_CREATED,
  MESSAGE_DELETED,
} from "../const.js";
import { WSResponse, WSErrorResponse, parceError } from "../lib/util.js";
import { productosService } from "../services/index.js";

const getProductos = async (req, res) => {
  try {
    const id = req.params.id;
    let response;
    if (id) {
      response = new WSResponse(
        await productosService.getAll({ categoria: id }, { nombre: 1 }),
        MESSAGE_OK
      );
    } else {
      response = new WSResponse(await productosService.getAll({}, { nombre: 1 }), MESSAGE_OK);
    }
    res.status(HTTP_STATUS_OK).send(response);
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const getProducto = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await productosService.getById(id);
    if (result) {
      res.status(HTTP_STATUS_OK).send(new WSResponse(result, MESSAGE_OK));
    } else {
      res
        .status(HTTP_STATUS_ERROR_NOT_FOUND)
        .send(new WSErrorResponse(MESSAGE_PRODUCT_NOT_FOUND, HTTP_STATUS_ERROR_NOT_FOUND));
    }
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const addProducto = async (req, res) => {
  try {
    await productosService.save(req.body);
    res.status(HTTP_STATUS_CREATED).send(new WSResponse({}, MESSAGE_CREATED));
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const updateProducto = async (req, res) => {
  try {
    const productoActualizado = req.body;
    const id = req.params.id;
    const result = await productosService.updateById(id, productoActualizado);
    if (result) {
      res.status(HTTP_STATUS_OK).send(new WSResponse(result, MESSAGE_OK));
    } else {
      res
        .status(HTTP_STATUS_ERROR_NOT_FOUND)
        .send(new WSErrorResponse(MESSAGE_PRODUCT_NOT_FOUND, HTTP_STATUS_ERROR_NOT_FOUND));
    }
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const deleteProducto = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await productosService.deleteById(id);
    if (result) {
      res.status(HTTP_STATUS_OK).send(new WSResponse(result, MESSAGE_DELETED));
    } else {
      res
        .status(HTTP_STATUS_ERROR_NOT_FOUND)
        .send(new WSErrorResponse(MESSAGE_PRODUCT_NOT_FOUND, HTTP_STATUS_ERROR_NOT_FOUND));
    }
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

export default {
  getProductos,
  getProducto,
  addProducto,
  updateProducto,
  deleteProducto,
};
