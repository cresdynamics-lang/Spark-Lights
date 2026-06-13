import app from "./app.js";
import prisma from "./config/prisma.js";

const PORT = Number(process.env.PORT) || 3001;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("postgres db connected");

    const server = app.listen(PORT);

    server.on("listening", () => {
      console.log(`API ready at http://localhost:${PORT}`);
    });

    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT} is already in use. Stop other dev servers or set PORT=3002 in .env.`
        );
      } else {
        console.error("Failed to bind server:", error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
