"use server";

import { db } from "./client";
import {
    user,
    session,
    account,
    verification,
    twoFactor,
    blogPost,
    blogCategory,
    blogSettings,
    featureFlags,
} from "./schema";

/**
 * Database export structure
 */
export interface DatabaseExport {
    version: string;
    exportedAt: string;
    tables: {
        users: typeof user.$inferSelect[];
        sessions: typeof session.$inferSelect[];
        accounts: typeof account.$inferSelect[];
        verifications: typeof verification.$inferSelect[];
        twoFactors: typeof twoFactor.$inferSelect[];
        blogPosts: typeof blogPost.$inferSelect[];
        blogCategories: typeof blogCategory.$inferSelect[];
        blogSettings: typeof blogSettings.$inferSelect[];
        featureFlags: typeof featureFlags.$inferSelect[];
    };
}

/**
 * Export entire database to JSON format
 */
export async function exportDatabase(): Promise<DatabaseExport> {
    try {
        const [
            users,
            sessions,
            accounts,
            verifications,
            twoFactors,
            blogPosts,
            blogCategories,
            blogSettingsData,
            featureFlagsData,
        ] = await Promise.all([
            db.select().from(user).all(),
            db.select().from(session).all(),
            db.select().from(account).all(),
            db.select().from(verification).all(),
            db.select().from(twoFactor).all(),
            db.select().from(blogPost).all(),
            db.select().from(blogCategory).all(),
            db.select().from(blogSettings).all(),
            db.select().from(featureFlags).all(),
        ]);

        return {
            version: "1.0.0",
            exportedAt: new Date().toISOString(),
            tables: {
                users,
                sessions,
                accounts,
                verifications,
                twoFactors,
                blogPosts,
                blogCategories,
                blogSettings: blogSettingsData,
                featureFlags: featureFlagsData,
            },
        };
    } catch (error) {
        console.error("Database export error:", error);
        throw new Error("Nie udało się wyeksportować bazy danych");
    }
}

/**
 * Export database and return as downloadable JSON string
 */
export async function exportDatabaseAsJson(): Promise<string> {
    const data = await exportDatabase();
    return JSON.stringify(data, null, 2);
}

/**
 * Get database statistics
 */
export async function getDatabaseStats() {
    try {
        const [
            users,
            sessions,
            accounts,
            verifications,
            twoFactors,
            blogPosts,
            blogCategories,
            featureFlagsData,
        ] = await Promise.all([
            db.select().from(user).all(),
            db.select().from(session).all(),
            db.select().from(account).all(),
            db.select().from(verification).all(),
            db.select().from(twoFactor).all(),
            db.select().from(blogPost).all(),
            db.select().from(blogCategory).all(),
            db.select().from(featureFlags).all(),
        ]);

        return {
            users: users.length,
            sessions: sessions.length,
            accounts: accounts.length,
            verifications: verifications.length,
            twoFactors: twoFactors.length,
            blogPosts: blogPosts.length,
            blogCategories: blogCategories.length,
            featureFlags: featureFlagsData.length,
        };
    } catch (error) {
        console.error("Database stats error:", error);
        throw new Error("Nie udało się pobrać statystyk bazy danych");
    }
}
