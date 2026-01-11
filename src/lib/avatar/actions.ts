"use server";

import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/database";
import { user } from "@/lib/auth/schema";
import { AVATAR_CONFIG, type AllowedImageType } from "./config";

interface UploadResult {
    success: boolean;
    url?: string;
    error?: string;
}

/**
 * Generates a unique filename for the avatar
 */
function generateFilename(userId: string, mimeType: AllowedImageType): string {
    const extension = mimeType.split("/")[1];
    const timestamp = Date.now();
    return `${userId}-${timestamp}.${extension}`;
}

/**
 * Gets the absolute path to the avatars directory
 */
function getAvatarsDir(): string {
    return path.join(process.cwd(), "public", AVATAR_CONFIG.directory);
}

/**
 * Ensures the avatars directory exists
 */
async function ensureAvatarsDir(): Promise<void> {
    const dir = getAvatarsDir();
    if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
    }
}

/**
 * Deletes old avatar file if it exists
 */
async function deleteOldAvatar(imageUrl: string | null): Promise<void> {
    if (!imageUrl) return;

    // Only delete if it's a local avatar (starts with /avatars/)
    if (!imageUrl.startsWith(`/${AVATAR_CONFIG.directory}/`)) return;

    const filename = imageUrl.split("/").pop();
    if (!filename) return;

    const filepath = path.join(getAvatarsDir(), filename);

    try {
        if (existsSync(filepath)) {
            await unlink(filepath);
        }
    } catch {
        // Ignore deletion errors
    }
}

/**
 * Uploads a new avatar for the current user
 * Automatically deletes the old avatar if one exists
 */
export async function uploadAvatar(formData: FormData): Promise<UploadResult> {
    try {
        // Get current session
        const headersList = await headers();
        const session = await auth.api.getSession({ headers: headersList });

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const file = formData.get("avatar") as File | null;

        if (!file) {
            return { success: false, error: "No file provided" };
        }

        // Validate file type
        if (!AVATAR_CONFIG.allowedTypes.includes(file.type as AllowedImageType)) {
            return { success: false, error: "Invalid file type. Allowed: JPG, PNG, WebP, GIF" };
        }

        // Validate file size
        if (file.size > AVATAR_CONFIG.maxSize) {
            return { success: false, error: "File too large. Maximum size: 2MB" };
        }

        // Ensure avatars directory exists
        await ensureAvatarsDir();

        // Get current user to check for existing avatar
        const [currentUser] = await db
            .select({ image: user.image })
            .from(user)
            .where(eq(user.id, session.user.id))
            .limit(1);

        // Delete old avatar if exists
        if (currentUser?.image) {
            await deleteOldAvatar(currentUser.image);
        }

        // Generate new filename and save file
        const filename = generateFilename(session.user.id, file.type as AllowedImageType);
        const filepath = path.join(getAvatarsDir(), filename);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        await writeFile(filepath, buffer);

        // Return the URL - session update is handled by client via updateUser
        const imageUrl = `/${AVATAR_CONFIG.directory}/${filename}`;

        return { success: true, url: imageUrl };
    } catch (error) {
        console.error("Avatar upload error:", error);
        return { success: false, error: "Failed to upload avatar" };
    }
}

/**
 * Deletes the current user's avatar
 */
export async function deleteAvatar(): Promise<UploadResult> {
    try {
        // Get current session
        const headersList = await headers();
        const session = await auth.api.getSession({ headers: headersList });

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Get current user
        const [currentUser] = await db
            .select({ image: user.image })
            .from(user)
            .where(eq(user.id, session.user.id))
            .limit(1);

        // Delete avatar file if exists
        if (currentUser?.image) {
            await deleteOldAvatar(currentUser.image);
        }

        // Session update is handled by client via updateUser
        return { success: true };
    } catch (error) {
        console.error("Avatar delete error:", error);
        return { success: false, error: "Failed to delete avatar" };
    }
}
