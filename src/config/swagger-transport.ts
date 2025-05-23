import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Transporte',
            version: '1.0.0',
            description: 'Documentación de la API de Transporte.',
        },
        servers: [
            {
                url: 'http://192.168.0.7:3000',
            },
        ],
    },
    apis: ['./src/controllers/transport*.ts'],
}

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;