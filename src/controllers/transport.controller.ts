import { Request, Response } from "express";
import axios from "axios";

export default class TransportController {
    /**
     * @swagger
     * /transport/ordenarTransporte:
     *   get:
     *     summary: Consulta las ventas realizadas para los proveedores.
     *     description: Consulta las ventas realizadas para los proveedores.
     *     tags:
     *       - Transporte
     *     responses:
     *       200:
     *         description: Orden de transporte generada correctamente.
     *       500:
     *         description: Error interno en el servidor.
     */
    async ordenarTransporte(req: Request, res: Response): Promise<void> {
        try {
            await axios.post('http://192.168.0.8:3000/logger/log',{
                    message:
                        `Se genera la orden de transporte.`,
                }, {validateStatus: () => true}
            );
            res.status(200).json({message: "Orden de transporte generada correctamente."});
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Hubo un error interno en el servidor." });
        }
    }
}
