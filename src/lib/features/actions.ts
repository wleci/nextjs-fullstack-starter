"use server";

import { db } from "@/lib/database/client";
import { featureFlags } from "./schema";
import { eq } from "drizzle-orm";
import { env } from "@/lib/env";
import { FEATURE_KEYS, type FeatureKey } from "./constants";

/**
 * Check if feature is enabled (runtime check from database)
 */
export async function isFeatureEnabled(key: FeatureKey): Promise<boolean> {
    try {
        const feature = await db
            .select()
            .from(featureFlags)
            .where(eq(featureFlags.key, key))
            .get();

        return feature?.enabled ?? true;
    } catch (error) {
        console.error(`Error checking feature ${key}:`, error);
        return true; // Default to enabled on error
    }
}

/**
 * Get all feature flags
 */
export async function getAllFeatures() {
    try {
        return await db.select().from(featureFlags).all();
    } catch (error) {
        console.error("Error fetching features:", error);
        return [];
    }
}

/**
 * Toggle feature flag
 */
export async function toggleFeature(
    key: FeatureKey,
    enabled: boolean,
    userId?: string,
): Promise<{ success: boolean; message: string }> {
    try {
        const existing = await db
            .select()
            .from(featureFlags)
            .where(eq(featureFlags.key, key))
            .get();

        if (existing) {
            await db
                .update(featureFlags)
                .set({
                    enabled,
                    updatedBy: userId,
                    updatedAt: new Date(),
                })
                .where(eq(featureFlags.key, key))
                .run();
        } else {
            await db
                .insert(featureFlags)
                .values({
                    id: crypto.randomUUID(),
                    key,
                    enabled,
                    updatedBy: userId,
                })
                .run();
        }

        return {
            success: true,
            message: `Feature ${key} ${enabled ? "enabled" : "disabled"}`,
        };
    } catch (error) {
        console.error(`Error toggling feature ${key}:`, error);
        return {
            success: false,
            message: "Failed to update feature",
        };
    }
}

/**
 * Initialize default features if they don't exist
 */
export async function initializeFeatures() {
    const defaults = [
        {
            id: crypto.randomUUID(),
            key: FEATURE_KEYS.REGISTRATION,
            enabled: true,
            description: "Allow new user registration",
        },
        {
            id: crypto.randomUUID(),
            key: FEATURE_KEYS.PASSWORD_RESET,
            enabled: true,
            description: "Allow password reset via email",
        },
        {
            id: crypto.randomUUID(),
            key: FEATURE_KEYS.SOCIAL_LOGIN,
            enabled: env.NEXT_PUBLIC_ENABLE_GOOGLE || env.NEXT_PUBLIC_ENABLE_DISCORD,
            description: "Allow social login (Google, Discord)",
        },
    ];

    for (const feature of defaults) {
        const existing = await db
            .select()
            .from(featureFlags)
            .where(eq(featureFlags.key, feature.key))
            .get();

        if (!existing) {
            await db.insert(featureFlags).values(feature).run();
        }
    }
}
