import {Express, NextFunction, Request, Response} from "express";
import { createServer } from "http";
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
dotenv.config();

import configureApp from './config';
import shopRoutes from "./routes/shop.routes";
import swaggerSpec from "./config/swagger";
const app: Express = configureApp();
const PORT: string | 3000 = process.env.PORT ?? 3000;
const server: any = createServer(app);

// Rutas de Express
app.use("/shop", shopRoutes);
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
    console.log(`Tienda escuchando en el puerto ${PORT}`);
});