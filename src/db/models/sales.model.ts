import { DataTypes } from 'sequelize';
import sequelize from '../../config/database';

const SalesModel = sequelize.define('tbl_sales', {
    nombres: { type: DataTypes.STRING, allowNull: false },
    apellidos: { type: DataTypes.STRING, allowNull: false },
    tipoDocumento: { type: DataTypes.STRING, allowNull: false, field: 'tipo_documento' },
    documento: { type: DataTypes.STRING, allowNull: false },
    producto: { type: DataTypes.STRING, allowNull: false },
    cantidad: { type: DataTypes.REAL, allowNull: false },
    precio: { type: DataTypes.REAL, allowNull: false },
});

export default SalesModel;