import express, {Router} from "express";
import ShopController from "../controllers/shop.controller";

const router: Router = express.Router();
const shopController = new ShopController();

// Rutas de ventas
router.post("/registrarVenta", shopController.registrarVenta);
router.get("/cargarProductos", shopController.cargarProductos);
router.post("/crearProducto", shopController.crearProducto);

export default router;