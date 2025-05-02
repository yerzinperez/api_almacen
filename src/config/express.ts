import express from "express";
import helmet from 'helmet';
import morgan from 'morgan';
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();

function configureExpressApp() {
    const app = express();
    app.use((req: any, res: any, next: any) => {
        // elimina cualquier Origin-Agent-Cluster que hubiera venido
        res.removeHeader('Origin-Agent-Cluster');
        next();
    });

    // Middleware de seguridad
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginEmbedderPolicy: false,
        originAgentCluster: false
    }));
    // Middleware para el registro de solicitudes
    app.use(morgan('dev'));
    // Otros middleware y configuraciones específicas de Express
    app.use(cors({
        origin: '*',
        methods: ['GET','POST','PUT','DELETE','OPTIONS'],
        allowedHeaders: ['Content-Type','Authorization']
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    return app;
}

export default configureExpressApp;