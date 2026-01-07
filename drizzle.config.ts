import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/lib/database/schema.ts",
    out: "./drizzle",
    dialect: "sqlite",
    dbCredentials: {
        url: process.env.DATABASE_URL || "sqlite.db",
    },
});
