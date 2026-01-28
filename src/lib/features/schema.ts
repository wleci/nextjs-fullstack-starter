import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * Feature flags table - runtime configuration
 */
export const featureFlags = sqliteTable("feature_flags", {
    id: text("id").primaryKey(),
    key: text("key").notNull().unique(),
    enabled: integer("enabled", { mode: "boolean" }).default(true).notNull(),
    description: text("description"),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .$onUpdate(() => new Date())
        .notNull(),
    updatedBy: text("updated_by"),
});

export type FeatureFlag = typeof featureFlags.$inferSelect;
export type NewFeatureFlag = typeof featureFlags.$inferInsert;
