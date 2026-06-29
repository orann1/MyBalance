import path from "node:path";
import { defineConfig } from "prisma/config";
import "dotenv/config";

// Prisma v7 configuration. DATABASE_URL is read from .env via dotenv.
// The Prisma CLI does not auto-load .env when evaluating prisma.config.ts,
// so dotenv/config is imported here to ensure the variable is available.
// See .env.example for the required format.
export default defineConfig({
  schema: path.join(__dirname, "prisma/schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
