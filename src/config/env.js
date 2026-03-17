// Imports
import "dotenv/config";

export const configuration = {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_DIALECT: process.env.DATABASE_DIALECT
};