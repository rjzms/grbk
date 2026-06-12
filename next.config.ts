import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma adapter packages must be external for server-side usage
  serverExternalPackages: ["@prisma/adapter-libsql", "@libsql/client"],
};

export default nextConfig;
