"use server";

import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { db } from "@/lib/database";
import { user } from "@/lib/auth/schema";
import { eq, and, isNotNull } from "drizzle-orm";
import { env } from "@/lib/env";
import { sendEmail, NewsletterEmail } from "@/lib/email";
import { render } from "@react-email/components";

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
 * Get newsletter subscribers count
 */
export async function getNewsletterStats() {
    await requireAdmin();

    const subscribers = await db
        .select({ id: user.id })
        .from(user)
        .where(
            and(
                eq(user.newsletterSubscribed, true),
                isNotNull(user.newsletterId)
            )
        );

    return {
        subscriberCount: subscribers.length,
    };
}

/**
 * Send newsletter to all subscribers
 */
export async function sendNewsletter(subject: string, content: string) {
    await requireAdmin();

    if (!subject.trim() || !content.trim()) {
        return { success: false, error: "Temat i treść są wymagane" };
    }

    try {
        // Get all subscribers
        const subscribers = await db
            .select({
                id: user.id,
                email: user.email,
                name: user.name,
                newsletterId: user.newsletterId,
            })
            .from(user)
            .where(
                and(
                    eq(user.newsletterSubscribed, true),
                    isNotNull(user.newsletterId)
                )
            );

        if (subscribers.length === 0) {
            return { success: false, error: "Brak subskrybentów" };
        }

        let sent = 0;
        let failed = 0;

        // Send email to each subscriber
        for (const subscriber of subscribers) {
            try {
                const unsubscribeUrl = `${env.NEXT_PUBLIC_APP_URL}/newsletter/unsubscribe/${subscriber.newsletterId}`;

                const html = await render(
                    NewsletterEmail({
                        subject,
                        content,
                        unsubscribeUrl,
                    })
                );

                await sendEmail({
                    to: subscriber.email,
                    subject,
                    html,
                });

                sent++;
            } catch (error) {
                console.error(`Failed to send to ${subscriber.email}:`, error);
                failed++;
            }
        }

        return {
            success: true,
            sent,
            failed,
            total: subscribers.length,
        };
    } catch (error) {
        console.error("Failed to send newsletter:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Błąd wysyłania newslettera",
        };
    }
}

/**
 * Send test newsletter to admin
 */
export async function sendTestNewsletter(subject: string, content: string) {
    const session = await requireAdmin();

    if (!subject.trim() || !content.trim()) {
        return { success: false, error: "Temat i treść są wymagane" };
    }

    try {
        const unsubscribeUrl = `${env.NEXT_PUBLIC_APP_URL}/newsletter/unsubscribe/test-preview`;

        const html = await render(
            NewsletterEmail({
                subject,
                content,
                unsubscribeUrl,
            })
        );

        await sendEmail({
            to: session.user.email,
            subject: `[TEST] ${subject}`,
            html,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send test newsletter:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Błąd wysyłania",
        };
    }
}
