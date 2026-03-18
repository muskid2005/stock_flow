// Imports
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import argon2 from "argon2";

// User model
export class User extends Model {
    async comparePassword(plain) {
        return await argon2.verify(this.password, plain)
    };
};

User.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true, },
        role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
        password: { type: DataTypes.STRING(), allowNull: false, }
    },

    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true,
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await argon2.hash(user.password);
                }
            },

            beforeUpdate: async (user) => {
                if (user.changed("password")) {
                    user.password = await argon2.hash(user.password);
                }
            }
        }
    }
);

export default User;