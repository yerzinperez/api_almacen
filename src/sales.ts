import {Express, NextFunction, Request, Response} from "express";
import { createServer } from "http";
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
dotenv.config();

import configureApp from './config';
import initializeDatabase from "./db";
import salesRoutes from "./routes/sales.routes";
import swaggerSpec from "./config/swagger-sales";

const app: Express = configureApp();
const PORT: string | 3000 = process.env.PORT ?? 3000;
const server: any = createServer(app);

initializeDatabase().then(r => console.log('Database connected.'));

// Rutas de Express
app.use("/sales", salesRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req: Request, res: Response): void => {
    res.redirect('/docs');
})

// Middleware de manejo de errores global
app.use((error: any, req: Request, res: Response, next: NextFunction): void => {
    console.error(error);

    // Envía una respuesta al cliente
    res.status(500).json({ message: 'Error interno en el servidor. ' + error });
});

server.listen(PORT, (): void => {
    console.log(`Ventas escuchando en el puerto ${PORT}`);
});