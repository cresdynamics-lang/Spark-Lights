import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import sequelize from "./config/db.js";
import "./models/index.js"; // Initialize models and associations

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("postgres db connected");

    // Sync models
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`backend is starting at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

app.get("/", (req, res) => {
  res.send("Spark Lights 254 API running...");
});

startServer();
