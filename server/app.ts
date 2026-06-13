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

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  "http://localhost:5173",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((o) => origin === o || origin.endsWith(".vercel.app"))) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

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

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Spark Lights 254 Admin API v1" });
});

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, database: "connected" });
  } catch {
    res.status(500).json({ success: false, database: "disconnected" });
  }
});

app.use(errorHandler);

export default app;
