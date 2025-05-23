import { Request, Response } from "express";
import InventoryModel from "../db/models/inventory.model";
import axios from "axios";

export default class ShopController {
    /**
     * @swagger
     * /shop/registrarVenta:
     *   post:
     *     summary: Registrar una venta.
     *     description: Registrar una venta en la base de datos con la información enviada.
     *     tags:
     *       - Tienda
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
     *                     id_producto:
     *                       type: integer
     *                       example: 1
     *     responses:
     *       200:
     *         description: Venta creada exitosamente y se ha generado la orden de transporte. Se ha generado la factura.
     *       400:
     *         description: Faltan datos para crear la venta. Por favor revise los parámetros ingresados.
     *       401:
     *         description: El valor de la venta debe ser positivo.
     *       402:
     *         description: El documento debe tener entre 8 y 10 caracteres.
     *       403:
     *         description: El tipo de documento solo puede ser 'CC'.
     *       500:
     *         description: Error interno en el servidor.
     */
    async registrarVenta(req: Request, res: Response): Promise<void> {
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
                    `Se ha intentado registrar una venta con los siguientes datos: ${nombres} ${apellidos} ${tipoDocumento} ${documento} ${productos}`,
                }, {validateStatus: () => true}
            );

            if (!nombres || !apellidos || !tipoDocumento || !documento || !productos || productos.length === 0) {
                res.status(400).json({ message: "Faltan datos para crear la venta. Por favor revise los parámetros ingresados." });
            } else if (documento.length < 8 || documento.length > 10) {
                res.status(402).json({ message: "El documento debe tener entre 8 y 10 caracteres." });
            } else if (tipoDocumento !== "CC") {
                res.status(403).json({ message: "El tipo de documento solo puede ser 'CC'." });
            }

            await axios.post('http://192.168.0.8:3000/logger/log',{
                    message:
                        `Se llamada al modulo de ventas.`,
                }, {validateStatus: () => true}
            );


            let response: any = await axios.post('http://192.168.0.4:3000/sales/registrarVenta', {
                "nombres": nombres,
                "apellidos": apellidos,
                "tipoDocumento": tipoDocumento,
                "documento": documento,
                "productos": productos
            }, {
                validateStatus: () => true
            });

            if ((response.data.message).includes('Factura generada exitosamente.')) {
                await axios.post('http://192.168.0.8:3000/logger/log',{
                        message:
                            `Se llama al modulo de transporte.`,
                    }, {validateStatus: () => true}
                );

                const response_transport = await axios.get('http://192.168.0.7:3000/transport/ordenarTransporte',
                    {validateStatus: () => true}
                );

                await axios.post('http://192.168.0.8:3000/logger/log',{
                        message:
                            `Se envía la respuesta al cliente.`,
                    }, {validateStatus: () => true}
                );

                // Se envía la respuesta obtenida de la otra API
                res.status(200).json(`${response.data.message} ${response_transport.data.message}`);
            } else {
                await axios.post('http://192.168.0.8:3000/logger/log',{
                        message:
                            `Se envía la respuesta al cliente con errores.`,
                    }, {validateStatus: () => true}
                );
                // Se envía la respuesta obtenida de la otra API
                res.status(200).json(`${response.data.message}`);
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Hubo un error interno en el servidor. " + error });
        }
    }
    
    /**
     * @swagger
     * /shop/cargarProductos:
     *   get:
     *     summary: Obtiene todas los productos
     *     description: Se obtienen todas las productos en formato JSON.
     *     tags:
     *       - Tienda
     *     responses:
     *       200:
     *         description: Array de productos.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 producto:
     *                   type: string
     *                   example: Mueble
     *                 Cantidad:
     *                   type: number
     *                   example: 1
     *                 createdAt:
     *                   type: date
     *                   example: 2025-04-11T01:59:59.672Z
     *                 updatedAt:
     *                   type: date
     *                   example: 2025-04-11T01:59:59.672Z
     *       500:
     *         description: Error interno en el servidor.
     */
    async cargarProductos(req: Request, res: Response): Promise<void> {
        try {
            await axios.post('http://192.168.0.8:3000/logger/log',{
                    message:
                        `Se llama al modulo de consultar productos.`,
                }, {validateStatus: () => true}
            );
            const response = await axios.get('http://192.168.0.3:3000/inventory/cargarProductos');
            // Se envía la respuesta obtenida de la otra API
            await axios.post('http://192.168.0.8:3000/logger/log',{
                    message:
                        `Se envía la respuesta al cliente.`,
                }, {validateStatus: () => true}
            );
            res.json(response.data);
        } catch (error) {
            console.log(error);
            res.status(500).json("Error interno en el servidor.");
        }
    }

    /**
     * @swagger
     * /shop/crearProducto:
     *   post:
     *     summary: Registrar un producto.
     *     description: Registrar un producto en la base de datos con la información enviada.
     *     tags:
     *       - Tienda
     *     requestBody:
     *       description: Objeto en formato JSON con los datos correspondientes.
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - producto
     *               - cantidad
     *             properties:
     *               producto:
     *                 type: string
     *                 description: Nombre del producto.
     *                 required: true
     *               cantidad:
     *                 type: integer
     *                 description: Cantidad del producto.
     *                 required: true
     *     responses:
     *       200:
     *         description: Producto creado exitosamente.
     *       500:
     *         description: Error interno en el servidor.
     */
    async crearProducto(req: Request, res: Response): Promise<void> {
        try {
            const {
                producto,
                cantidad
            } = req.body;

            await axios.post('http://192.168.0.8:3000/logger/log',{
                    message:
                        `Se crea un producto con los siguientes datos: ${producto} ${cantidad}`,
                }, {validateStatus: () => true}
            );

            const created = await InventoryModel.create({
                producto,
                cantidad
            })

            await axios.post('http://192.168.0.8:3000/logger/log',{
                    message:
                        `Se envía la respuesta al cliente.`,
                }, {validateStatus: () => true}
            );

            // Se envía la respuesta obtenida de la otra API
            res.status(200).json(created);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Hubo un error interno en el servidor. " + error });
        }
    }
}
