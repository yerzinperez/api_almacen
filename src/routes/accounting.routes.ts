import express, {Router} from "express";
import AccountingController from "../controllers/accouting.controller";

const router: Router = express.Router();
const accountingController = new AccountingController();

// Rutas de ventas
router.post("/generarFactura", accountingController.generarFactura);

export default router;