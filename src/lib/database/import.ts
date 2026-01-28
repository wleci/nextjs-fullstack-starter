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
import type { DatabaseExport } from "./export";

/**
 * Validate database export structure
 */
function validateDatabaseExport(data: unknown): data is DatabaseExport {
    if (!data || typeof data !== "object") {
        return false;
    }

    const exportData = data as Partial<DatabaseExport>;

    if (!exportData.version || !exportData.exportedAt || !exportData.tables) {
        return false;
    }

    const { tables } = exportData;
    if (!tables || typeof tables !== "object") {
        return false;
    }

    // Check if all required tables exist
    const requiredTables = [
        "users",
        "sessions",
        "accounts",
        "verifications",
        "twoFactors",
        "blogPosts",
        "blogCategories",
        "blogSettings",
        "featureFlags",
    ];

    for (const tableName of requiredTables) {
        if (!Array.isArray((tables as Record<string, unknown>)[tableName])) {
            return false;
        }
    }

    return true;
}

/**
 * Clear all data from database
 */
async function clearDatabase() {
    // Delete in correct order to respect foreign key constraints
    await db.delete(session).run();
    await db.delete(account).run();
    await db.delete(twoFactor).run();
    await db.delete(verification).run();
    await db.delete(user).run();
    await db.delete(blogPost).run();
    await db.delete(blogCategory).run();
    await db.delete(blogSettings).run();
    await db.delete(featureFlags).run();
}

/**
 * Import database from JSON export
 * @param jsonData - JSON string or parsed object
 * @param clearExisting - Whether to clear existing data before import
 */
export async function importDatabase(
    jsonData: string | DatabaseExport,
    clearExisting = false,
): Promise<{ success: boolean; message: string; imported: Record<string, number> }> {
    try {
        // Parse JSON if string
        const data =
            typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;

        // Validate structure
        if (!validateDatabaseExport(data)) {
            throw new Error("Nieprawidłowa struktura pliku eksportu");
        }

        // Clear existing data if requested
        if (clearExisting) {
            await clearDatabase();
        }

        const { tables } = data;
        const imported: Record<string, number> = {};

        // Import in correct order to respect foreign key constraints
        // 1. Users first (no dependencies)
        if (tables.users.length > 0) {
            for (const userData of tables.users) {
                await db.insert(user).values(userData).onConflictDoNothing().run();
            }
            imported.users = tables.users.length;
        }

        // 2. Sessions (depends on users)
        if (tables.sessions.length > 0) {
            for (const sessionData of tables.sessions) {
                await db.insert(session).values(sessionData).onConflictDoNothing().run();
            }
            imported.sessions = tables.sessions.length;
        }

        // 3. Accounts (depends on users)
        if (tables.accounts.length > 0) {
            for (const accountData of tables.accounts) {
                await db.insert(account).values(accountData).onConflictDoNothing().run();
            }
            imported.accounts = tables.accounts.length;
        }

        // 4. Two Factor (depends on users)
        if (tables.twoFactors.length > 0) {
            for (const twoFactorData of tables.twoFactors) {
                await db.insert(twoFactor).values(twoFactorData).onConflictDoNothing().run();
            }
            imported.twoFactors = tables.twoFactors.length;
        }

        // 5. Verifications (no dependencies)
        if (tables.verifications.length > 0) {
            for (const verificationData of tables.verifications) {
                await db
                    .insert(verification)
                    .values(verificationData)
                    .onConflictDoNothing()
                    .run();
            }
            imported.verifications = tables.verifications.length;
        }

        // 6. Blog categories (no dependencies)
        if (tables.blogCategories.length > 0) {
            for (const categoryData of tables.blogCategories) {
                await db
                    .insert(blogCategory)
                    .values(categoryData)
                    .onConflictDoNothing()
                    .run();
            }
            imported.blogCategories = tables.blogCategories.length;
        }

        // 7. Blog posts (no dependencies)
        if (tables.blogPosts.length > 0) {
            for (const postData of tables.blogPosts) {
                await db.insert(blogPost).values(postData).onConflictDoNothing().run();
            }
            imported.blogPosts = tables.blogPosts.length;
        }

        // 8. Blog settings (no dependencies)
        if (tables.blogSettings.length > 0) {
            for (const settingsData of tables.blogSettings) {
                await db
                    .insert(blogSettings)
                    .values(settingsData)
                    .onConflictDoNothing()
                    .run();
            }
            imported.blogSettings = tables.blogSettings.length;
        }

        // 9. Feature flags (no dependencies)
        if (tables.featureFlags.length > 0) {
            for (const flagData of tables.featureFlags) {
                await db
                    .insert(featureFlags)
                    .values(flagData)
                    .onConflictDoNothing()
                    .run();
            }
            imported.featureFlags = tables.featureFlags.length;
        }

        return {
            success: true,
            message: "Baza danych została pomyślnie zaimportowana",
            imported,
        };
    } catch (error) {
        console.error("Database import error:", error);

        if (error instanceof SyntaxError) {
            throw new Error("Nieprawidłowy format JSON");
        }

        if (error instanceof Error) {
            throw new Error(`Import nie powiódł się: ${error.message}`);
        }

        throw new Error("Nie udało się zaimportować bazy danych");
    }
}

/**
 * Validate import file without importing
 */
export async function validateImportFile(
    jsonData: string,
): Promise<{ valid: boolean; message: string; stats?: Record<string, number> }> {
    try {
        const data = JSON.parse(jsonData);

        if (!validateDatabaseExport(data)) {
            return {
                valid: false,
                message: "Nieprawidłowa struktura pliku eksportu",
            };
        }

        const stats: Record<string, number> = {
            users: data.tables.users.length,
            sessions: data.tables.sessions.length,
            accounts: data.tables.accounts.length,
            verifications: data.tables.verifications.length,
            twoFactors: data.tables.twoFactors.length,
            blogPosts: data.tables.blogPosts.length,
            blogCategories: data.tables.blogCategories.length,
            blogSettings: data.tables.blogSettings.length,
            featureFlags: data.tables.featureFlags.length,
        };

        return {
            valid: true,
            message: "Plik jest prawidłowy i gotowy do importu",
            stats,
        };
    } catch (error) {
        if (error instanceof SyntaxError) {
            return {
                valid: false,
                message: "Nieprawidłowy format JSON",
            };
        }

        return {
            valid: false,
            message: "Nie udało się zwalidować pliku",
        };
    }
}
