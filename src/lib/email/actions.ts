"use server";

import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { sendEmail } from "./client";
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
            device: "Chrome on Windows",
            location: "Warszawa, Polska",
            time: new Date().toLocaleString("pl-PL"),
            ip: "192.168.1.1",
        };

        let html: string;
        let subject: string;

        switch (template) {
            case "welcome":
                html = Welcome({ name: testData.name, loginUrl: testData.url });
                subject = "Witamy w serwisie!";
                break;
            case "verify":
                html = VerifyEmail({ name: testData.name, verifyUrl: testData.url });
                subject = "Zweryfikuj swój email";
                break;
            case "reset":
                html = ResetPassword({ name: testData.name, resetUrl: testData.url });
                subject = "Reset hasła";
                break;
            case "2fa":
                html = TwoFactor({ name: testData.name, code: testData.code });
                subject = "Kod weryfikacyjny 2FA";
                break;
            case "login":
                html = LoginNotification({
                    name: testData.name,
                    device: testData.device,
                    location: testData.location,
                    time: testData.time,
                    ip: testData.ip
                });
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
