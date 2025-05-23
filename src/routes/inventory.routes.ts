import express, {Router} from "express";
import InventoryController from "../controllers/inventory.controller";

const router: Router = express.Router();
const inventoryController = new InventoryController();

// Rutas de ventas
router.post("/actualizarInventario", inventoryController.update);
router.get("/cargarProductos", inventoryController.findAll);

export default router;