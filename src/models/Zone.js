// Imports
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

// Zone model
class Zone extends Model {}

Zone.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    zone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isIn: [["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"]],
      },
    },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    currentStock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },

  {
    sequelize,
    modelName: "Zone",
    tableName: "zones",
    timestamps: true,
  },
);

export default Zone;
