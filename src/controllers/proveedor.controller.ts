import { Request, Response } from "express";
import axios from "axios";

export default class ProveedorController {
    /**
     * @swagger
     * /proveedor/registrarCompra:
     *   get:
     *     summary: Consulta las ventas realizadas para los proveedores.
     *     description: Consulta las ventas realizadas para los proveedores.
     *     tags:
     *       - Proveedores
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
    async registrarCompra(req: Request, res: Response): Promise<void> {
        try {
            await axios.post('http://192.168.0.8:3000/logger/log',{
                    message:
                        `Se consultan las ventas realizadas para los proveedores.`,
                }, {validateStatus: () => true}
            );
            const response: any = await axios.get('http://192.168.0.4:3000/sales/obtenerVentas');

            await axios.post('http://192.168.0.8:3000/logger/log',{
                    message:
                        `Se envía la respuesta al cliente.`,
                }, {validateStatus: () => true}
            );
            res.status(200).json({message: response.data});
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Hubo un error interno en el servidor." });
        }
    }
}
