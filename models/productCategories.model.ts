import { DataTypes } from "sequelize";
import { sequelize } from "../configs/mysqlDatabase";

export const ProductCategories = sequelize.define('product_categories', {
  categoryId: {
    type: DataTypes.INTEGER,
  },

  productId: {
    type: DataTypes.INTEGER,
  }
})