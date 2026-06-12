// Prisma client with conditional adapter based on DATABASE_URL
import { PrismaClient } from "@/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const isPostgres = databaseUrl.startsWith("postgres");

let prismaClient: PrismaClient;

if (isPostgres) {
  // PostgreSQL for production - use POSTGRES_PRISMA_URL for better pooling
  const { PrismaNeon } = require("@prisma/adapter-neon");
  const { Pool, neonConfig } = require("@neondatabase/serverless");

  // Use fetch for build-time to avoid WebSocket issues
  if (process.env.NODE_ENV === "production" && typeof WebSocket === "undefined") {
    neonConfig.webSocketConstructor = require("ws");
  }

  const connectionString = process.env.POSTGRES_PRISMA_URL || databaseUrl;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  prismaClient = new PrismaClient({ adapter });
} else {
  // SQLite for local development
  const { PrismaLibSql } = require("@prisma/adapter-libsql");
  const adapter = new PrismaLibSql({ url: databaseUrl });
  prismaClient = new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const client = globalForPrisma.prisma || prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = client;
}

export { client as prisma };
