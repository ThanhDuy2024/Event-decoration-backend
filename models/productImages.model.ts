import { DataTypes } from "sequelize";
import { sequelize } from "../configs/mysqlDatabase";

export const ProductImages = sequelize.define('product_images', {
  productId: {
    type: DataTypes.INTEGER,
  },

  images: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});