import { Request, Response } from "express";
import PurchasesModel from "../db/models/purchases.model";
import {Model} from "sequelize";
import axios from "axios";

export default class PurchasesController {
    /**
     * @swagger
     * /purchases:
     *   post:
     *     summary: Crea una nueva compra
     *     description: Crea una nueva compra en la base de datos con la información enviada.
     *     tags:
     *       - Compras
     *     requestBody:
     *       description: Objeto en formato JSON con los datos correspondientes.
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - nombres
     *               - apellidos
     *               - valor
     *             properties:
     *               nombres:
     *                 type: string
     *                 description: Nombre o nombres del usuario.
     *                 required: true
     *               apellidos:
     *                 type: string
     *                 description: Apellido o apellidos del usuario.
     *                 required: true
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
     *     responses:
     *       201:
     *         description: Compra creada exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 nombres:
     *                   type: string
     *                   example: Pepito
     *                 apellidos:
     *                   type: string
     *                   example: Pérez
     *                 valor:
     *                   type: number
     *                   example: 1000
     *                 createdAt:
     *                   type: date
     *                   example: 2025-04-11T01:59:59.672Z
     *                 updatedAt:
     *                   type: date
     *                   example: 2025-04-11T01:59:59.672Z
     *       400:
     *         description: Error en la creación de la compra. Revisar los parámetros ingresados.
     *       500:
     *         description: Error interno en el servidor.
     */
    async create(req: Request, res: Response): Promise<void> {
        try {
            const {
                nombres,
                apellidos,
                productos
            } = req.body;

            /*const purchase: Model<any, any> = await PurchasesModel.create({
                nombres,
                apellidos,
                valor
            });*/

            const response = await axios.post('http://10.8.8.124:5000/factura/recibir', {
                "cliente": nombres + " " + apellidos,
                "productos": productos
            });

            res.status(201).json(response.data);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Hubo un error al crear la compra." });
        }
    }

    /**
     * @swagger
     * /purchases:
     *   get:
     *     summary: Obtiene todas las compras
     *     description: Se obtienen todas las compras en formato JSON.
     *     tags:
     *       - Compras
     *     responses:
     *       200:
     *         description: Array de compras.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 nombres:
     *                   type: string
     *                   example: Pepito
     *                 apellidos:
     *                   type: string
     *                   example: Pérez
     *                 valor:
     *                   type: number
     *                   example: 1000
     *                 createdAt:
     *                   type: date
     *                   example: 2025-04-11T01:59:59.672Z
     *                 updatedAt:
     *                   type: date
     *                   example: 2025-04-11T01:59:59.672Z
     *       500:
     *         description: Error interno en el servidor.
     */
    async findAll(req: Request, res: Response): Promise<void> {
        try {

            const purchases: Model<any, any>[] = await PurchasesModel.findAll();

            res.status(200).json(purchases);
        } catch (error) {
            console.log(error);
        }
    }
}
