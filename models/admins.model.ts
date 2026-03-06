import { DataTypes } from "sequelize";
import { sequelize } from "../configs/mysqlDatabase";

export const Admin = sequelize.define( "admins", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: 'email_unique',
      msg: 'Email address already in use!'
    },
    validate:{
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
    allowNull: true,
  },

  role: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
}, {
  timestamps: true,
})