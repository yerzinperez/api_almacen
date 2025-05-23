import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Tienda',
            version: '1.0.0',
            description: 'Documentación de la API de Tienda.',
        },
        servers: [
            {
                url: 'http://192.168.0.2:3000',
            },
        ],
    },
    apis: ['./src/controllers/shop*.ts'],
}

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;