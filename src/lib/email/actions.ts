"use server";

import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { sendEmail } from "./client";
import { render } from "@react-email/components";
import {
    Welcome,
    VerifyEmail,
    ResetPassword,
    TwoFactor,
    LoginNotification
} from "./templates";

export type EmailTemplate = "welcome" | "verify" | "reset" | "2fa" | "login";

interface SendTestEmailParams {
    to: string;
    template: EmailTemplate;
}

export async function sendTestEmail({ to, template }: SendTestEmailParams) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== "admin") {
        return { success: false, error: "Brak uprawnień" };
    }

    try {
        const testData = {
            name: "Test User",
            url: "https://example.com/test-link",
            code: "123456",
            userAgent: "Chrome on Windows",
            ipAddress: "192.168.1.1",
            timestamp: new Date().toLocaleString("pl-PL"),
        };

        let html: string;
        let subject: string;

        switch (template) {
            case "welcome":
                html = await render(Welcome({ name: testData.name, loginUrl: testData.url }));
                subject = "Witamy w serwisie!";
                break;
            case "verify":
                html = await render(VerifyEmail({ name: testData.name, verifyUrl: testData.url }));
                subject = "Zweryfikuj swój email";
                break;
            case "reset":
                html = await render(ResetPassword({ name: testData.name, resetUrl: testData.url }));
                subject = "Reset hasła";
                break;
            case "2fa":
                html = await render(TwoFactor({ name: testData.name, code: testData.code }));
                subject = "Kod weryfikacyjny 2FA";
                break;
            case "login":
                html = await render(LoginNotification({
                    name: testData.name,
                    userAgent: testData.userAgent,
                    ipAddress: testData.ipAddress,
                    timestamp: testData.timestamp,
                }));
                subject = "Nowe logowanie na Twoje konto";
                break;
            default:
                return { success: false, error: "Nieznany szablon" };
        }

        await sendEmail({ to, subject: `[TEST] ${subject}`, html });

        return { success: true };
    } catch (error) {
        console.error("Failed to send test email:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Błąd wysyłania emaila"
        };
    }
}
