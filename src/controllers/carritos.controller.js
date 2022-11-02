import config from "../config.js";
import { sendMail } from "../lib/mailer.js";
import logger from "../lib/logger.js";
import { productosService, carritosService, ordenesService } from "../services/index.js";
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
  HTTP_STATUS_ERROR_BAD_REQUEST,
  HTTP_STATUS_ERROR_NOT_FOUND,
  MESSAGE_PRODUCT_NOT_FOUND,
  MESSAGE_CART_NOT_FOUND,
  MESSAGE_EMPTY_CART,
  MESSAGE_CREATED,
  MESSAGE_DELETED,
  MESSAGE_OK,
  MESSAGE_ADDED,
} from "../const.js";
import { WSResponse, WSErrorResponse, parceError } from "../lib/util.js";

function indexOfProduct(idBuscado, products) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id == idBuscado) return i;
  }
  return -1;
}

function getItemCount(cartItems) {
  return cartItems.reduce((pv, cv) => {
    return pv + cv.stock;
  }, 0);
}

const addCarrito = async (req, res) => {
  try {
    const idCarrito = await carritosService.save({ productos: [] });
    res.status(HTTP_STATUS_CREATED).send(new WSResponse({ idCarrito }, MESSAGE_CREATED));
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const deleteCarrito = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await carritosService.deleteById(id);
    if (result) {
      res.status(HTTP_STATUS_OK).send(new WSResponse({}, MESSAGE_DELETED));
    } else {
      res
        .status(HTTP_STATUS_ERROR_NOT_FOUND)
        .send(new WSErrorResponse(MESSAGE_CART_NOT_FOUND, HTTP_STATUS_ERROR_NOT_FOUND));
    }
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const getCarritos = async (req, res) => {
  try {
    res.status(HTTP_STATUS_OK).send(new WSResponse(await carritosService.getAll(), MESSAGE_OK));
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const getProductosCarrito = async (req, res) => {
  try {
    const id = req.params.id;
    const carrito = await carritosService.getById(id);
    if (carrito) {
      res.status(HTTP_STATUS_OK).send(new WSResponse(carrito.productos, MESSAGE_OK));
    } else {
      res
        .status(HTTP_STATUS_ERROR_NOT_FOUND)
        .send(new WSErrorResponse(MESSAGE_CART_NOT_FOUND, HTTP_STATUS_ERROR_NOT_FOUND));
    }
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const getProductosCountCarrito = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await carritosService.getById(id);
    if (result) {
      const itemsCount = getItemCount(result.productos);
      res.status(HTTP_STATUS_OK).send(new WSResponse({ itemsCount }, MESSAGE_OK));
    } else {
      res
        .status(HTTP_STATUS_ERROR_NOT_FOUND)
        .send(new WSErrorResponse(MESSAGE_CART_NOT_FOUND, HTTP_STATUS_ERROR_NOT_FOUND));
    }
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const addProductoCarrito = async (req, res) => {
  try {
    const id = req.params.id;
    const carrito = await carritosService.getById(id);
    if (carrito) {
      const idProducto = req.body.idProducto;
      const index = indexOfProduct(idProducto, carrito.productos);
      if (index !== -1) {
        // se trata de un producto que ya esta en el carrito
        // incremento en uno la cantidad
        carrito.productos[index].stock++;
        await carritosService.updateById(id, carrito);
        const itemsCount = getItemCount(carrito.productos);
        res.status(HTTP_STATUS_OK).send(new WSResponse({ itemsCount }, MESSAGE_ADDED));
        return;
      }
      const producto = await productosService.getById(idProducto);
      if (producto) {
        const nuevoProducto = { ...producto };
        nuevoProducto.stock = 1;
        carrito.productos.push(nuevoProducto);
        await carritosService.updateById(id, carrito);
        const itemsCount = getItemCount(carrito.productos);
        res.status(HTTP_STATUS_OK).send(new WSResponse({ itemsCount }, MESSAGE_ADDED));
      } else {
        res
          .status(HTTP_STATUS_ERROR_NOT_FOUND)
          .send(new WSErrorResponse(MESSAGE_PRODUCT_NOT_FOUND, HTTP_STATUS_ERROR_NOT_FOUND));
      }
    } else {
      res
        .status(HTTP_STATUS_ERROR_NOT_FOUND)
        .send(new WSErrorResponse(MESSAGE_CART_NOT_FOUND, HTTP_STATUS_ERROR_NOT_FOUND));
    }
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

const deleteProductoCarrito = async (req, res) => {
  try {
    const id = req.params.id;
    const id_prod = req.params.id_prod;
    const carrito = await carritosService.getById(id);
    if (carrito) {
      if (id_prod) {
        const index = indexOfProduct(id_prod, carrito.productos);
        if (index > -1) {
          carrito.productos.splice(index, 1);
          await carritosService.updateById(id, carrito);
          res.status(HTTP_STATUS_OK).send(new WSResponse(carrito.productos, MESSAGE_DELETED));
        } else {
          res
            .status(HTTP_STATUS_ERROR_NOT_FOUND)
            .send(new WSErrorResponse(MESSAGE_PRODUCT_NOT_FOUND, HTTP_STATUS_ERROR_NOT_FOUND));
        }
      } else {
        carrito.productos = [];
        await carritosService.updateById(id, carrito);
        res.status(HTTP_STATUS_OK).send(new WSResponse(carrito.productos, MESSAGE_DELETED));
      }
    } else {
      res
        .status(HTTP_STATUS_ERROR_NOT_FOUND)
        .send(new WSErrorResponse(MESSAGE_CART_NOT_FOUND, HTTP_STATUS_ERROR_NOT_FOUND));
    }
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

// const deleteProductosCarrito = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const carrito = await carritosService.getById(id);
//     if (carrito) {
//       carrito.productos = [];
//       await carritosService.updateById(id, carrito);
//       res.status(HTTP_STATUS_OK).send(new WSResponse({}, MESSAGE_DELETED));
//     } else {
//       res
//         .status(HTTP_STATUS_ERROR_NOT_FOUND)
//         .send(new WSErrorResponse(MESSAGE_CART_NOT_FOUND, HTTP_STATUS_ERROR_NOT_FOUND));
//     }
//   } catch (error) {
//     error = parceError(error);
//     logger.error(error);
//     res
//       .status(HTTP_STATUS_ERROR_BAD_REQUEST)
//       .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
//   }
// };

const makePurchase = async (req, res) => {
  try {
    const id = req.params.id;
    const carrito = await carritosService.getById(id);
    if (carrito) {
      if (carrito.productos.length > 0) {
        const ordenId = await ordenesService.save({
          usuario: req.user.id,
          productos: [...carrito.productos],
          estado: "generada",
        });
        const orden = await ordenesService.getById(ordenId);
        const orderNo = orden.numero;
        const subjectAdmin =
          "Nuevo pedido - Orden #" +
          orderNo +
          " / " +
          req.user.nombreApellido +
          " / " +
          req.user.email;
        const subjectClient = "WineHouse Tienda de vinos - Orden #" + orderNo;
        let html =
          "<table><tr><th>Cantidad</th><th>Producto</th><th>Unitario</th><th>Total</th></tr>";
        let importeTotal = 0;
        for (const producto of carrito.productos) {
          const precioTotalProducto = producto.precio * producto.stock;
          importeTotal += precioTotalProducto;
          html += `<tr><td>${producto.stock}</td><td>${producto.nombre}</td><td>${producto.precio}</td><td>${precioTotalProducto}</td></tr>`;
        }
        html += `<tr><td></td><td></td><td>Total:</td><td>${importeTotal}</td></tr>`;
        html += `</table>`;

        // Enviar mail con el pedido al administrador
        await sendMail("WineHouse - Tienda de vinos", config.adminMail, subjectAdmin, html);
        // Enviar mail con el pedido al cliente
        html =
          "Hemos recibido su pedido, y será procesado a la brevedad.<br>Numero de orden #" +
          orderNo +
          " " +
          html;
        await sendMail("WineHouse - Tienda de vinos", req.user.email, subjectClient, html);
        // Vaciar el carrito
        carrito.productos = [];
        await carritosService.updateById(id, carrito);
        res.status(HTTP_STATUS_OK).send(new WSResponse({}, MESSAGE_OK));
      } else {
        res
          .status(HTTP_STATUS_ERROR_BAD_REQUEST)
          .send(new WSErrorResponse(MESSAGE_EMPTY_CART, HTTP_STATUS_ERROR_BAD_REQUEST));
      }
    } else {
      res
        .status(HTTP_STATUS_ERROR_NOT_FOUND)
        .send(new WSErrorResponse(MESSAGE_CART_NOT_FOUND, HTTP_STATUS_ERROR_NOT_FOUND));
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
  addCarrito,
  deleteCarrito,
  getCarritos,
  getProductosCarrito,
  getProductosCountCarrito,
  addProductoCarrito,
  deleteProductoCarrito,
  makePurchase,
};
