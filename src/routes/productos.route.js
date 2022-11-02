import { Router } from "express";
import { productosController } from "../controllers/index.js";
import { isAdmin } from "../middleware/session.js";

const router = Router();

router.route("/categoria/:id").get(productosController.getProductos);
router
  .route("/")
  .get(productosController.getProductos)
  .post(isAdmin, productosController.addProducto);
router
  .route("/:id")
  .get(productosController.getProducto)
  .put(isAdmin, productosController.updateProducto)
  .delete(isAdmin, productosController.deleteProducto);

export default router;
