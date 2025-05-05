import { Request, Response } from "express";
import SalesModel from "../db/models/sales.model";
import {Model} from "sequelize";

export default class SalesController {
    /**
     * @swagger
     * /sales:
     *   post:
     *     summary: Crea una nueva venta
     *     description: Crea una nueva venta en la base de datos con la información enviada.
     *     tags:
     *       - Ventas
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
     *               - tipoDocumento
     *               - documento
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
     *               tipoDocumento:
     *                  type: string
     *                  description: Tipo de documento del usuario. Por el momento, solo 'CC'.
     *                  required: true
     *               documento:
     *                  type: string
     *                  description: Número de documento. Mínimo 8 caracteres y máximo 10.
     *                  required: true
     *               valor:
     *                  type: number
     *                  description: Valor de la venta. Sin signo de moneda y sin puntos ni comas.
     *                  required: true
     *     responses:
     *       200:
     *         description: Venta creada exitosamente.
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
     *                 tipoDocumento:
     *                   type: string
     *                   example: CC
     *                 documento:
     *                   type: string
     *                   example: 1234567890
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
     *         description: Faltan datos para crear la venta.
     *       401:
     *         description: El valor de la venta debe ser positivo.
     *       402:
     *         description: El documento debe tener entre 8 y 10 caracteres.
     *       403:
     *         description: El tipo de documento solo puede ser 'CC'.
     *       500:
     *         description: Error interno en el servidor.
     */
    async create(req: Request, res: Response): Promise<void> {
        try {
            const {
                nombres,
                apellidos,
                tipoDocumento,
                documento,
                valor
            } = req.body;

            if (!nombres || !apellidos || !tipoDocumento || !documento || isNaN(valor)) {
                res.status(400).json({ message: "Faltan datos para crear la venta." });
            } else if (valor < 0) {
                res.status(401).json({ message: "El valor de la venta debe ser positivo." });
            } else if (documento.length < 8 || documento.length > 10) {
                res.status(402).json({ message: "El documento debe tener entre 8 y 10 caracteres." });
            } else if (tipoDocumento !== "CC") {
                res.status(403).json({ message: "El tipo de documento solo puede ser 'CC'." });
            }

            const sale: Model<any, any> = await SalesModel.create({
                nombres,
                apellidos,
                tipoDocumento,
                documento,
                valor
            });

            res.status(201).json(sale);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Hubo un error al crear la venta." });
        }
    }

    /**
     * @swagger
     * /sales:
     *   get:
     *     summary: Obtiene todas las ventas
     *     description: Se obtienen todas las ventas en formato JSON.
     *     tags:
     *       - Ventas
     *     responses:
     *       200:
     *         description: Array de ventas.
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
     *                 tipoDocumento:
     *                   type: string
     *                   example: CC
     *                 documento:
     *                   type: string
     *                   example: 1234567890
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

            const sales: Model<any, any>[] = await SalesModel.findAll();

            res.status(200).json(sales);
        } catch (error) {
            console.log(error);
        }
    }
}
