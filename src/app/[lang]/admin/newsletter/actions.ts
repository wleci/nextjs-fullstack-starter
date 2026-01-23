"use server";

import { sendEmail } from "@/lib/email/client";

export async function testNewsletterEmail(formData: FormData) {
    try {
        const to = formData.get("to") as string;
        const subject = formData.get("subject") as string;
        const content = formData.get("content") as string;

        // Simple HTML template for newsletter
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${subject}</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h1 style="color: #2563eb; margin: 0;">${subject}</h1>
                </div>

                <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                    <div style="white-space: pre-wrap;">${content}</div>
                </div>

                <div style="margin-top: 20px; padding: 20px; background: #f3f4f6; border-radius: 8px; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">
                        This is a test newsletter email.
                    </p>
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af;">
                        <a href="#" style="color: #6b7280;">Unsubscribe</a> |
                        <a href="#" style="color: #6b7280;">Update Preferences</a>
                    </p>
                </div>
            </body>
            </html>
        `;

        await sendEmail({
            to,
            subject,
            html: htmlContent,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send newsletter:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}

export async function getNewsletterStats() {
    try {
        // Mock data - replace with actual database queries
        const stats = {
            total: 0,
            active: 0,
        };

        return { success: true, data: stats };
    } catch (error) {
        console.error("Failed to get newsletter stats:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
