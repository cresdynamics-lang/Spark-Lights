import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.STRING, // Storing as string to match "3,500" format from content, but ideally should be DECIMAL
    allowNull: false,
  },
  oldPrice: {
    type: DataTypes.STRING,
  },
  badge: {
    type: DataTypes.STRING,
  },
  img: {
    type: DataTypes.STRING,
  },
  tag: {
    type: DataTypes.STRING,
  },
  shortDesc: {
    type: DataTypes.TEXT,
  },
  longDesc: {
    type: DataTypes.TEXT,
  },
  careInstructions: {
    type: DataTypes.TEXT,
  },
  sizes: {
    type: DataTypes.JSONB, // Storing sizes array as JSON
  },
});

export default Product;
