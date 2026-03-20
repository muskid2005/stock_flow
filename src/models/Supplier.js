import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Supplier = sequelize.define(
  "Supplier",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    supplierCode: {
      type: DataTypes.STRING,
      unique: true,
    },

    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    contactName: {
      type: DataTypes.STRING,
    },

    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },

    phone: {
      type: DataTypes.STRING,
    },

    address: {
      type: DataTypes.TEXT,
    },

    city: {
      type: DataTypes.STRING,
    },

    region: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.ENUM("active", "inactive", "pending"),
      defaultValue: "active",
    },

    deliveryRate: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default Supplier;
