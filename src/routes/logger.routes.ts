import express, {Router} from "express";
import LoggerController from "../controllers/logger.controller";

const router: Router = express.Router();
const loggerController = new LoggerController();

router.post("/log", loggerController.log);

export default router;