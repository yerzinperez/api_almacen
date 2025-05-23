import { Request, Response } from "express";
import axios from "axios";

export default class AccountingController {
    /**
     * @swagger
     * /accounting/generarFactura:
     *   post:
     *     summary: Genera una factura de venta.
     *     description: Genera una nueva factura de venta con los datos proporcionados.
     *     tags:
     *       - Contabilidad
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
     *         description: Factura generada exitosamente.
     *       400:
     *         description: No se pudo generar la factura, ya que hubo un error al actualizar el inventario.
     *       500:
     *         description: Error interno en el servidor.
     */
    async generarFactura(req: Request, res: Response): Promise<void> {
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
                        `Se llama al modulo de inventario`,
                }, {validateStatus: () => true}
            );

            const response: any = await axios.post('http://192.168.0.3:3000/inventory/actualizarInventario', {
                "productos": productos
            }, {
                validateStatus: () => true
            });

            await axios.post('http://192.168.0.8:3000/logger/log',{
                    message:
                        `Se envía la respuesta al cliente.`,
                }, {validateStatus: () => true}
            );

            if (response.data.message == 'Inventario actualizado correctamente.') {
                res.status(200).json({message: 'Factura generada exitosamente. ' + response.data.message});
            } else {
                res.status(400).json({message: 'No se pudo generar la factura, ya que hubo un error al actualizar el inventario: ' + response.data.message});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Hubo un error interno en el servidor. " + error });
        }
    }
}
