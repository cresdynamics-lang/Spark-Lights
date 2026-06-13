import pkg from 'pg';
const { Client } = pkg;
import dotenv from "dotenv";

dotenv.config();

// Extract DB name from URL or use default
const dbUrl = process.env.DATABASE_URL || "";
const dbName = "flower_admin";

const connectionString = dbUrl.replace(`/${dbName}`, "/postgres");

async function initDb() {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }
  } catch (err) {
    console.error("Error creating database:", err);
  } finally {
    await client.end();
  }
}

initDb();
