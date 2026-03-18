// Imports
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

// Outgoing model
class Outgoing extends Model {

};

Outgoing.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "users", key: "id" } },
        incomingId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "incomings", key: "id" } },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        destination: { type: DataTypes.STRING, allowNull: false }
    },

    {
        sequelize,
        modelName: "Outgoing",
        tableName: "outgoings",
        timestamps: true,
    }
);

export default Outgoing;