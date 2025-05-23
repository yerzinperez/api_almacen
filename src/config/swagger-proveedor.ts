import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Proveedor',
            version: '1.0.0',
            description: 'Documentación de la API de Proveedor.',
        },
        servers: [
            {
                url: 'http://192.168.0.6:3000',
            },
        ],
    },
    apis: ['./src/controllers/proveedor*.ts'],
}

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;