import { DataTypes } from 'sequelize';
import sequelize from '../../config/database';

const PurchasesModel: any = sequelize.define('tbl_purchases', {
    nombres: { type: DataTypes.STRING, allowNull: false },
    apellidos: { type: DataTypes.STRING, allowNull: false },
    valor: { type: DataTypes.REAL, allowNull: false },
});

export default PurchasesModel;