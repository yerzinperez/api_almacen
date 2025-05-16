import {Express, NextFunction, Request, Response} from "express";
import { createServer } from "http";
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
dotenv.config();

import configureApp from './config';
import initializeDatabase from "./db";
import salesRoutes from "./routes/sales.routes";
import purchasesRoutes from "./routes/purchases.routes";
import swaggerSpec from "./config/swagger";
import axios from "axios";

const app: Express = configureApp();
const PORT: string | 3000 = process.env.PORT ?? 3000;
const server: any = createServer(app);

initializeDatabase().then(r => console.log('Database connected.'));

// Rutas de Express
app.use("/sales", salesRoutes);
app.use("/purchases", purchasesRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
/**
 * @swagger
 * /consumir-g-factura:
 *   post:
 *     summary: Consume una API para generar facturas.
 *     description: Se obtienen datos de la api externa.
 *     tags:
 *       - API Externa - Generar factura.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente:
 *                 type: string
 *                 example: Juan Perez
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     cantidad:
 *                       type: integer
 *                       example: 1
 *                     precio:
 *                       type: integer
 *                       example: 2500
 *                     producto_id:
 *                       type: integer
 *                       example: 1
 *
 *     responses:
 *       200:
 *         description: Array de datos.
 *       500:
 *         description: Error interno en el servidor.
 */
app.post('/consumir-g-factura', async (req, res) => {
    try {
        const {
            cliente,
            productos
        } = req.body;
        console.log(productos)
        const response = await axios.post('http://10.8.8.124:5000/factura/generar', {
            "cliente": cliente,
            "productos": productos
        });
        // Se envía la respuesta obtenida de la otra API
        res.json(response.data);
    } catch (error) {
        console.error('Error en la petición POST:', error);
        res.status(500).json({ error: 'Error al consumir la API externa' });
    }
});
/**
 * @swagger
 * /consumir-r-factura:
 *   post:
 *     summary: Consume una API para recibir facturas.
 *     description: Se obtienen datos de la api externa.
 *     tags:
 *       - API Externa - Recibir factura.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente:
 *                 type: string
 *                 example: Juan Perez
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     cantidad:
 *                       type: integer
 *                       example: 1
 *                     precio:
 *                       type: integer
 *                       example: 2500
 *                     producto_id:
 *                       type: integer
 *                       example: 1
 *
 *     responses:
 *       200:
 *         description: Array de datos.
 *       500:
 *         description: Error interno en el servidor.
 */
app.post('/consumir-r-factura', async (req, res) => {
    try {
        const {
            cliente,
            productos
        } = req.body;
        const response = await axios.post('http://10.8.8.124:5000/factura/recibir', {
            "cliente": cliente,
            "productos": productos
        });
        // Se envía la respuesta obtenida de la otra API
        res.json(response.data);
    } catch (error) {
        console.error('Error en la petición POST:', error);
        res.status(500).json({ error: 'Error al consumir la API externa' });
    }
});
app.get('/', (req: Request, res: Response): void => {
    res.redirect('/docs');
})

// Middleware de manejo de errores global
app.use((error: any, req: Request, res: Response, next: NextFunction): void => {
    console.error(error);

    // Envía una respuesta al cliente
    res.status(500).json({ message: 'Error interno en el servidor. ' + error });
});

server.listen(PORT, "0.0.0.0", (): void => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});