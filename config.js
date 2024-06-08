import { config } from "dotenv";
config();

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/multimediaapp";
export const PORT = process.env.PORT || 5000;
export const SECRET = process.env.JWT_SECRET || "secret";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@email.com";
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123*";