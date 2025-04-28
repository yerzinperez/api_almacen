import express, {Router} from "express";
import PurchasesController from "../controllers/purchases.controller";

const router: Router = express.Router();
const purchasesController = new PurchasesController();

// Rutas de compras
router.post("/", purchasesController.create);
router.get("/", purchasesController.findAll);

export default router;