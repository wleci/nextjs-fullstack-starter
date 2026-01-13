"use server";

import { auth } from "./server";
import { headers } from "next/headers";
import { db } from "@/lib/database";
import { user, verification } from "./schema";
import { eq } from "drizzle-orm";
import { env } from "@/lib/env";
import { sendEmail, ResetPassword, VerifyEmail } from "@/lib/email";
import { render } from "@react-email/components";
import { nanoid } from "nanoid";

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

/**
 * Send password reset email to user (admin only)
 */
export async function adminSendResetPassword(userId: string) {
    await requireAdmin();

    const [targetUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

    if (!targetUser) {
        return { success: false, error: "Użytkownik nie znaleziony" };
    }

    try {
        // Generate reset token
        const token = nanoid(32);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Store token in verification table
        await db.insert(verification).values({
            id: nanoid(),
            identifier: targetUser.email,
            value: token,
            expiresAt,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Build reset URL
        const resetUrl = `${env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

        // Send email
        const html = await render(
            ResetPassword({
                name: targetUser.name ?? "User",
                resetUrl,
            })
        );

        await sendEmail({
            to: targetUser.email,
            subject: "Reset hasła",
            html,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send reset password email:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Błąd wysyłania emaila"
        };
    }
}

/**
 * Send verification email to user (admin only)
 */
export async function adminSendVerificationEmail(userId: string) {
    await requireAdmin();

    const [targetUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

    if (!targetUser) {
        return { success: false, error: "Użytkownik nie znaleziony" };
    }

    if (targetUser.emailVerified) {
        return { success: false, error: "Email już zweryfikowany" };
    }

    try {
        // Generate verification token
        const token = nanoid(32);
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Store token in verification table
        await db.insert(verification).values({
            id: nanoid(),
            identifier: targetUser.email,
            value: token,
            expiresAt,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Build verify URL
        const verifyUrl = `${env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}&callbackURL=/auth/verify-email`;

        // Send email
        const html = await render(
            VerifyEmail({
                name: targetUser.name ?? "User",
                verifyUrl,
            })
        );

        await sendEmail({
            to: targetUser.email,
            subject: "Zweryfikuj swój email",
            html,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send verification email:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Błąd wysyłania emaila"
        };
    }
}

/**
 * Set new password for user (admin only)
 */
export async function adminSetUserPassword(userId: string, newPassword: string) {
    await requireAdmin();

    try {
        await auth.api.setUserPassword({
            body: {
                userId,
                newPassword,
            },
            headers: await headers(),
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to set user password:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Błąd ustawiania hasła"
        };
    }
}
