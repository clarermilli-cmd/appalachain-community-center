import { resolve } from "node:path";

const list = (value: string | undefined, fallback: string) =>
  (value ?? fallback)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const config = {
  port: Number(process.env.PORT ?? 4000),
  isProd: process.env.NODE_ENV === "production",
  allowedOrigins: list(process.env.ALLOWED_ORIGINS, "http://localhost:5173"),
  databasePath: resolve(process.env.DATABASE_PATH ?? "./data/community-center.db"),
  uploadDir: resolve(process.env.UPLOAD_DIR ?? "./uploads"),
};
