import { Request, Response } from "express";
import SalesModel from "../db/models/sales.model";
import {Model} from "sequelize";
import axios from "axios";

export default class SalesController {
    /**
     * @swagger
     * /sales/registrarVenta:
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
     *               - productos
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
     *       200:
     *         description: Venta creada exitosamente.
     *       400:
     *         description: Faltan datos para crear la venta. Por favor revise los parámetros ingresados.
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
                productos
            } = req.body;

            await axios.post('http://192.168.0.8:3000/logger/log',{
                    message:
                        `Se llama al modulo de contabilidad.`,
                }, {validateStatus: () => true}
            );

            const response: any = await axios.post('http://192.168.0.5:3000/accounting/generarFactura', {
                "nombres": nombres,
                "apellidos": apellidos,
                "tipoDocumento": tipoDocumento,
                "documento": documento,
                "productos": productos
            } , {
                validateStatus: () => true
            });

            if ((response.data.message).includes('Factura generada exitosamente.')) {
                await axios.post('http://192.168.0.8:3000/logger/log',{
                        message:
                            `Se crea la venta.`,
                    }, {validateStatus: () => true}
                );
                for (const item of productos) {
                    await SalesModel.create({
                        nombres,
                        apellidos,
                        tipoDocumento,
                        documento,
                        producto: item.id_producto,
                        cantidad: item.cantidad,
                        precio: parseInt(item.cantidad) * parseInt(item.precio)
                    })
                }

                await axios.post('http://192.168.0.8:3000/logger/log',{
                        message:
                            `Se envía la respuesta al cliente.`,
                    }, {validateStatus: () => true}
                );
                // Se envía la respuesta obtenida de la otra API
                res.status(200).json({message: `Venta creada exitosamente. ${response.data.message}`});
            } else {
                await axios.post('http://192.168.0.8:3000/logger/log',{
                        message:
                            'No se pudo crear la venta: ' + response.data.message,
                    }, {validateStatus: () => true}
                );
                res.status(400).json({message: 'No se pudo crear la venta: ' + response.data.message});
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Hubo un error interno en el servidor. " + error });
        }
    }

    /**
     * @swagger
     * /sales/obtenerVentas:
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
     *                 id_producto:
     *                   type: integer
     *                   example: 1
     *                 cantidad:
     *                   type: integer
     *                   example: 10
     *                 precio:
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
