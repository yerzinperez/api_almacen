import { Request, Response } from "express";

export default class LoggerController {
    /**
     * @swagger
     * /logger/log:
     *   get:
     *     summary: Genera un log.
     *     description: Genera un log en la terminal.
     *     tags:
     *       - Logger
     *     responses:
     *       200:
     *         description: Log generado correctamente.
     *       500:
     *         description: Error interno en el servidor.
     */
    async log(req: Request, res: Response): Promise<void> {
        try {
            const {message} = req.body;

            console.log(message);

            res.status(200).json({message: "Log generado correctamente."});
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Hubo un error interno en el servidor." });
        }
    }
}
