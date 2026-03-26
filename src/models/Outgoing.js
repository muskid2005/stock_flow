// Imports
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

// Outgoing model
class Outgoing extends Model {}

Outgoing.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
    incomingId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    productName: { type: DataTypes.STRING, allowNull: false },
    zoneName: {
      type: DataTypes.ENUM("Zone A", "Zone B", "Zone C", "Zone D", "Zone E"),
    },
    incomingIds: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "in_transit", "delivered"),
      defaultValue: "pending",
    },
  },

  {
    sequelize,
    modelName: "Outgoing",
    tableName: "outgoings",
    timestamps: true,
  },
);

export default Outgoing;
