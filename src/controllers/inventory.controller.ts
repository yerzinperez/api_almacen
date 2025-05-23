import { Request, Response } from "express";
import InventoryModel from "../db/models/inventory.model";
import {Model, Sequelize, Transaction} from "sequelize";
import axios from "axios";

export default class InventoryController {
    /**
     * @swagger
     * /inventory/actualizarInventario:
     *   post:
     *     summary: Actualizar el inventario.
     *     description: Actualizar el inventario en la base de datos con la información enviada. La cantidad de producto enviada se descontará del inventario.
     *     tags:
     *       - Inventario
     *     requestBody:
     *       description: Objeto en formato JSON con los datos correspondientes.
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - productos
     *             properties:
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
     *         description: Inventario actualizado correctamente.
     *       400:
     *         description: Faltan datos para actualizar el inventario.
     *       401:
     *         description: Algún producto no fue encontrado.
     *       402:
     *         description: Stock insuficiente para el producto con ID X. Lo disponible es L y lo requerido es Z.
     *       500:
     *         description: Error interno en el servidor.
     */
    async update(req: Request, res: Response): Promise<void> {
        try {
            const {
                productos
            } = req.body;

            await axios.post('http://192.168.0.8:3000/logger/log',{
                    message:
                        `Se intenta actualizar el inventario con los siguientes datos: ${productos}`,
                }, {validateStatus: () => true}
            );

            if (!productos || productos.length === 0) {
                await axios.post('http://192.168.0.8:3000/logger/log',{
                        message:
                            `Faltan datos para actualizar el inventario.`,
                    }, {validateStatus: () => true}
                );
                res.status(400).json({ message: "Faltan datos para actualizar el inventario." });
            }

            const sequelize: Sequelize = InventoryModel.sequelize!;

            // Iniciar transacción
            const t = await sequelize.transaction({
                isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ
            });

            try {
                // 1. Obtener todos los productos con bloqueo FOR UPDATE
                const ids = productos.map((i: { id_producto: any; }) => i.id_producto);
                const consulta: any = await InventoryModel.findAll({
                    where: { id: ids },
                    lock: t.LOCK.UPDATE,
                    transaction: t
                });

                // 2. Verificar que todos los pedidos existan y tengan suficiente stock
                console.log(consulta);
                for (const item of productos) {
                    console.log(item);
                    const producto: any = consulta.find((p: { id: any; }) => p.id === item.id_producto);
                    if (!producto) {
                        await axios.post('http://192.168.0.8:3000/logger/log',{
                                message:
                                    `Producto ${item.id_producto} no encontrado.`,
                            }, {validateStatus: () => true}
                        );
                        res.status(401).json({ message: `Producto ${item.id_producto} no encontrado.`});
                        return;
                    }
                    if (producto.cantidad < item.cantidad) {
                        await axios.post('http://192.168.0.8:3000/logger/log',{
                                message:
                                    `Stock insuficiente para el producto con ID ${item.id_producto}. Lo disponible es ${producto.cantidad} y lo requerido es ${item.cantidad}.`,
                            }, {validateStatus: () => true}
                        );
                        res.status(402).json({
                            message: `Stock insuficiente para el producto con ID ${item.id_producto}. Lo disponible es ${producto.cantidad} y lo requerido es ${item.cantidad}.`
                        })
                        return;
                    }
                }

                // 3. Si llegamos aquí, todos tienen stock; procedemos a descontarlo
                for (const item of productos) {
                    // Método decrement es atómico y respeta la transacción
                    await InventoryModel.decrement(
                        { cantidad: item.cantidad },
                        { where: { id: item.id_producto }, transaction: t }
                    );
                }

                // 4. Commit de la transacción
                await t.commit();
                await axios.post('http://192.168.0.8:3000/logger/log',{
                        message:
                            `Se actualiza el inventario correctamente.`,
                    }, {validateStatus: () => true}
                );
                res.status(200).json({message: "Inventario actualizado correctamente."});
            } catch (error: any) {
                // Si hay cualquier error, rollback y no se hace ninguna actualización
                await t.rollback();
                console.log(error);
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Hubo un error interno en el servidor. " + error });
        }
    }
    
    /**
     * @swagger
     * /inventory/cargarProductos:
     *   get:
     *     summary: Obtiene todas los productos
     *     description: Se obtienen todas las productos en formato JSON.
     *     tags:
     *       - Inventario
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
    async findAll(req: Request, res: Response): Promise<void> {
        try {

            const inventory: Model<any, any>[] = await InventoryModel.findAll();

            res.status(200).json(inventory);
        } catch (error) {
            console.log(error);
            res.status(500).json("Error interno en el servidor.");
        }
    }
}
