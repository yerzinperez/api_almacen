import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Logger',
            version: '1.0.0',
            description: 'Documentación de la API de Logger.',
        },
        servers: [
            {
                url: 'http://192.168.0.8:3000',
            },
        ],
    },
    apis: ['./src/controllers/logger*.ts'],
}

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;