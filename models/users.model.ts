import { DataTypes } from "sequelize";
import { sequelize } from "../configs/mysqlDatabase";

export const Users = sequelize.define('users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        unique: {
            name: 'email_unique',
            msg: 'Email address already in use!'
        },
        validate: {
            isEmail: {
                msg: 'Must be a valid email address'
            }
        }
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    image: {
        type: DataTypes.STRING,
        allowNull: true
    },

    address: {
        type: DataTypes.STRING,
        allowNull: true
    },

    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
    }
}, {
    timestamps: true
})