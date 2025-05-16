import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Ventas y Compras',
            version: '1.0.0',
            description: 'Documentación de la API de Ventas y Compras.',
        },
        servers: [
            {
                url: 'http://10.8.8.123:3000',
            },
        ],
    },
    apis: ['./src/controllers/*.ts', './src/app.ts'],
}

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;