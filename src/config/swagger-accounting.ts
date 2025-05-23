import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Contabilidad',
            version: '1.0.0',
            description: 'Documentación de la API de Inventario.',
        },
        servers: [
            {
                url: 'http://192.168.0.5:3000',
            },
        ],
    },
    apis: ['./src/controllers/accounting*.ts'],
}

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;