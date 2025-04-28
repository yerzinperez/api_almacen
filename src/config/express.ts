import express from "express";
import helmet from 'helmet';
import morgan from 'morgan';
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();

function configureExpressApp() {
    const app = express();

    // Middleware de seguridad
    app.use(helmet());
    app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
    // Middleware para el registro de solicitudes
    app.use(morgan('dev'));
    // Otros middleware y configuraciones específicas de Express
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    return app;
}

export default configureExpressApp;