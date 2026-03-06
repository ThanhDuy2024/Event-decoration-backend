import { DataTypes } from "sequelize";
import { sequelize } from "../configs/mysqlDatabase";
import { Product } from "./products.model";

export const Categories = sequelize.define('categories', {
  categoryName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  image: {
    type: DataTypes.STRING,
    allowNull: true
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  },

  createdBy: DataTypes.INTEGER,

  updatedBy: DataTypes.INTEGER,
}, {
  timestamps: true,
})