import { DataTypes } from 'sequelize';
import sequelize from '../../config/database';

const InventoryModel = sequelize.define('tbl_inventory', {
    producto: { type: DataTypes.STRING, allowNull: false },
    cantidad: { type: DataTypes.REAL, allowNull: false },
});

export default InventoryModel;