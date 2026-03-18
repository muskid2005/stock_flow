// Imports
import { Sequelize } from "sequelize";
import { configuration } from "./env.js";

// Setup database config
const sequelize = new Sequelize(configuration.DATABASE_URL, {
    dialect: configuration.DATABASE_DIALECT,
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
    },
});

export default sequelize;