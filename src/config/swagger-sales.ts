import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Ventas',
            version: '1.0.0',
            description: 'Documentación de la API de Ventas.',
        },
        servers: [
            {
                url: 'http://192.168.0.4:3000',
            },
        ],
    },
    apis: ['./src/controllers/sales*.ts'],
}

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;