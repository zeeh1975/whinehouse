const validEmailRegex =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const validUrlRegex =
  /^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$/;
const HTTP_STATUS_ERROR_BAD_REQUEST = 400;
const HTTP_STATUS_ERROR_UNAUTHORIZED = 401;
const HTTP_STATUS_ERROR_NOT_FOUND = 404;
const HTTP_STATUS_ERROR_INTERNAL_SERVER_ERROR = 500;
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;

const DAO_MONGO = "mongo";
const DAO_MEMORIA = "memoria";
const DAO_ARCHIVO = "archivo";

const MESSAGE_PRODUCT_NOT_FOUND = "El producto no existe";
const MESSAGE_CART_NOT_FOUND = "El id de carrito no es valido";
const MESSAGE_EMPTY_CART = "El carrito esta vacio";
const MESSAGE_INVALID_USER = "Usuario o contraseña no validos";
const MESSAGE_UNAUTHORIZED_RESOURCE = "No tiene autorizacion para acceder este recurso";
const MESSAGE_UNAUTHORIZED_RESOURCE_ADMIN =
  "Se requiere permiso de administrador para acceder este recurso";
const MESSAGE_INTERNAL_SERVER_ERROR = "Ha ocurrido un error interno del servidor";
const MESSAGE_CREATED = "created";
const MESSAGE_DELETED = "deleted";
const MESSAGE_OK = "ok";
const MESSAGE_ADDED = "added";

export {
  validEmailRegex,
  validUrlRegex,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_ERROR_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_ERROR_BAD_REQUEST,
  HTTP_STATUS_ERROR_NOT_FOUND,
  HTTP_STATUS_ERROR_UNAUTHORIZED,
  HTTP_STATUS_OK,
  DAO_ARCHIVO,
  DAO_MONGO,
  DAO_MEMORIA,
  MESSAGE_PRODUCT_NOT_FOUND,
  MESSAGE_CART_NOT_FOUND,
  MESSAGE_EMPTY_CART,
  MESSAGE_INVALID_USER,
  MESSAGE_UNAUTHORIZED_RESOURCE,
  MESSAGE_UNAUTHORIZED_RESOURCE_ADMIN,
  MESSAGE_INTERNAL_SERVER_ERROR,
  MESSAGE_CREATED,
  MESSAGE_DELETED,
  MESSAGE_OK,
  MESSAGE_ADDED,
};
