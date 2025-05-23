import express, {Router} from "express";
import ProveedorController from "../controllers/proveedor.controller";

const router: Router = express.Router();
const proveedorController = new ProveedorController();

// Rutas de ventas
router.get("/registrarCompra", proveedorController.registrarCompra);

export default router;