import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";
import prisma from "./config/prisma.js";
import authRoutes from "./modules/auth/auth.routes.js";
import productRoutes from "./modules/products/products.routes.js";
import orderRoutes from "./modules/orders/orders.routes.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import analyticsRoutes from "./modules/analytics/analytics.routes.js";
import customersRoutes from "./modules/customers/customers.routes.js";
import deliveryRoutes from "./modules/delivery/delivery.routes.js";
import settingsRoutes from "./modules/settings/settings.routes.js";
import discountsRoutes from "./modules/discounts/discounts.routes.js";
import subscriptionsRoutes from "./modules/subscriptions/subscriptions.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/v1/auth", authRoutes);
app.use("/v1/products", productRoutes);
app.use("/v1/orders", orderRoutes);
app.use("/v1/inventory", inventoryRoutes);
app.use("/v1/analytics", analyticsRoutes);
app.use("/v1/customers", customersRoutes);
app.use("/v1/delivery", deliveryRoutes);
app.use("/v1/settings", settingsRoutes);
app.use("/v1/discounts", discountsRoutes);
app.use("/v1/subscriptions", subscriptionsRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Marigold Flowers Admin API v1" });
});

// Health check
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, database: "connected" });
  } catch (error) {
    res.status(500).json({ success: false, database: "disconnected" });
  }
});

// Error handling
app.use(errorHandler);

const startServer = async () => {
  try {
    // Check DB connection
    await prisma.$connect();
    console.log("postgres db connected");

    app.listen(PORT, () => {
      console.log(`backend is starting at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
