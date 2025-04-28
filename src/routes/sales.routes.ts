import express, {Router} from "express";
import SalesController from "../controllers/sales.controller";

const router: Router = express.Router();
const salesController = new SalesController();

// Rutas de ventas
router.post("/", salesController.create);
router.get("/", salesController.findAll);

export default router;