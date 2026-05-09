import User from "./User.js";
import Product from "./Product.js";
import Category from "./Category.js";

// Associations
Product.belongsToMany(Category, { through: "ProductCategories" });
Category.belongsToMany(Product, { through: "ProductCategories" });

export { User, Product, Category };
