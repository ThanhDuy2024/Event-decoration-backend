import { DataTypes } from "sequelize";
import { sequelize } from "../configs/mysqlDatabase";
import { Categories } from "./categories.model";
import { ProductImages } from "./productImages.model";

export const Product = sequelize.define('products', {
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
  },

  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  price: DataTypes.INTEGER,

  quantity: DataTypes.INTEGER,

  createdBy: DataTypes.INTEGER,

  updatedBy: DataTypes.INTEGER,
}, {
  timestamps: true,
})

Categories.belongsToMany(Product, {
  through: 'product_categories',
  foreignKey: "categoryId"
});

Product.belongsToMany(Categories, {
  through: 'product_categories',
  foreignKey: "productId"
});

Product.hasMany(ProductImages, {
  foreignKey: "product_id",
  as: "productImages"
});
ProductImages.belongsTo(Product, {
  foreignKey: 'productId'
});