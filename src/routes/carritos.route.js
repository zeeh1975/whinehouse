import { Router } from "express";
//import { apiAuth }  from "../middleware/session.js";
import { carritosController } from "../controllers/index.js";

const router = Router();

router.route("/").post(carritosController.addCarrito);
router.route("/:id").delete(carritosController.deleteCarrito);
router
  .route("/:id/productos")
  .get(carritosController.getProductosCarrito)
  .post(carritosController.addProductoCarrito)
  .delete(carritosController.deleteProductoCarrito);
router.route("/:id/productos/:id_prod").delete(carritosController.deleteProductoCarrito);
router.route("/:id/productos/count").get(carritosController.getProductosCountCarrito);
router.route("/:id/purchase").post(carritosController.makePurchase);

export default router;
