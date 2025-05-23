import express, {Router} from "express";
import SalesController from "../controllers/sales.controller";

const router: Router = express.Router();
const salesController = new SalesController();

// Rutas de ventas
router.post("/registrarVenta", salesController.create);
router.get("/obtenerVentas", salesController.findAll);

export default router;