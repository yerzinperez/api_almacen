import express, {Router} from "express";
import TransportController from "../controllers/transport.controller";

const router: Router = express.Router();
const transportController = new TransportController();

router.get("/ordenarTransporte", transportController.ordenarTransporte);

export default router;