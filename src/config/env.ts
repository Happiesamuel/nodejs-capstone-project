import dotenv from "dotenv";

dotenv.config();

function checkRequireEnvVariables(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env variables for ${key}`);
  }
  return value;
}

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  isProduction: (process.env.NODE_ENV ?? "development") === "production",
  nodeEnv: process.env.NODE_ENV ?? "development",
  logLevel: process.env.LOG_LEVEL ?? "info",
  databaseUrl: checkRequireEnvVariables("DATABASE_URL"),
  jwtAccessSecret: checkRequireEnvVariables("JWT_SECRET"),
  jwtAccessExpiresIn: checkRequireEnvVariables("JWT_ACCESS_EXPIRES_IN"),
} as const;
