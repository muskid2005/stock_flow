// Imports
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

// Incoming model
class Incoming extends Model {}

Incoming.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    sku: { type: DataTypes.STRING, allowNull: false, unique: true },
    productName: { type: DataTypes.STRING, allowNull: false },
    supplier: { type: DataTypes.STRING, allowNull: false },
    zoneName: {
      type: DataTypes.ENUM("Zone A", "Zone B", "Zone C", "Zone D", "Zone E"),
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    referenceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "N/A",
    },
  },

  {
    sequelize,
    modelName: "Incoming",
    tableName: "incomings",
    timestamps: true,
    hooks: {
      beforeCreate: async (incoming) => {
        const count = await Incoming.count({
          where: { zoneName: incoming.zoneName },
        });
        const nextNumber = count + 1;
        const formattedNumber = String(nextNumber).padStart(4, "0");
        const zoneLetter = incoming.zoneName?.split(" ")[1];
        incoming.sku = `SKU-${formattedNumber}-${zoneLetter}`;
      },
    },
  },
);

export default Incoming;
