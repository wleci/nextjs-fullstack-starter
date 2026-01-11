"use server";

import { auth } from "./server";
import { headers } from "next/headers";
import { db } from "@/lib/database";
import { user } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Check if user is admin
 */
async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }
    return session;
}

/**
 * Update user data (admin only)
 */
export async function updateUserAdmin(userId: string, data: { name?: string; email?: string }) {
    await requireAdmin();

    const updateData: { name?: string; email?: string } = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;

    if (Object.keys(updateData).length === 0) {
        throw new Error("No data to update");
    }

    await db.update(user).set(updateData).where(eq(user.id, userId));

    return { success: true };
}
