import sequelize from '../config/database';

export default async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida exitosamente.');

        // Si quieres sincronizar los modelos automáticamente
        await sequelize.sync({ alter: true }); // Cambiar a `force: false` en producción
        console.log('Modelos sincronizados con la base de datos.');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    }
}