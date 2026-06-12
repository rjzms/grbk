// Prisma client with conditional adapter based on DATABASE_URL
import { PrismaClient } from "@/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const isPostgres = databaseUrl.startsWith("postgres");

let prismaClient: PrismaClient;

if (isPostgres) {
  // PostgreSQL for production - use non-pooling URL for build, pooled for runtime
  const { PrismaNeon } = require("@prisma/adapter-neon");
  const { Pool, neonConfig } = require("@neondatabase/serverless");

  // Disable WebSocket - use HTTP fetch instead
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineConnect = false;

  // Use non-pooling URL for more reliable build-time connections
  const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL || databaseUrl;
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
