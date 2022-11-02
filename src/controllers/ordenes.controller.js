import logger from "../lib/logger.js";
import { HTTP_STATUS_OK, HTTP_STATUS_ERROR_BAD_REQUEST, MESSAGE_OK } from "../const.js";
import { WSResponse, WSErrorResponse, parceError } from "../lib/util.js";
import { ordenesService } from "../services/index.js";

const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await ordenesService.getAll({ usuario: userId });
    res.status(HTTP_STATUS_OK).send(new WSResponse(result, MESSAGE_OK));
  } catch (error) {
    error = parceError(error);
    logger.error(error);
    res
      .status(HTTP_STATUS_ERROR_BAD_REQUEST)
      .send(new WSErrorResponse(error, HTTP_STATUS_ERROR_BAD_REQUEST));
  }
};

export default { getOrders };
