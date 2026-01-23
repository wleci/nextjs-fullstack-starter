"use server";

import { sendEmail } from "@/lib/email/client";
import { VerifyEmail } from "@/lib/email/templates/verify-email";
import { ResetPassword } from "@/lib/email/templates/reset-password";
import { TwoFactor } from "@/lib/email/templates/two-factor";
import { Welcome } from "@/lib/email/templates/welcome";
import { render } from "@react-email/render";

export async function sendTestEmail(formData: FormData) {
    try {
        const to = formData.get("to") as string;
        const template = formData.get("template") as string;
        const subject = formData.get("subject") as string;
        const userName = formData.get("userName") as string || "Test User";
        const customDataStr = formData.get("customData") as string;

        let customData = {};
        if (customDataStr) {
            try {
                customData = JSON.parse(customDataStr);
            } catch {
                return { success: false, error: "Invalid JSON in custom data" };
            }
        }

        let emailTemplate;
        let defaultSubject;

        switch (template) {
            case "verify-email":
                emailTemplate = VerifyEmail({
                    name: userName,
                    verifyUrl: "https://example.com/verify?token=test123",
                    ...customData,
                });
                defaultSubject = "Verify your email address";
                break;

            case "reset-password":
                emailTemplate = ResetPassword({
                    name: userName,
                    resetUrl: "https://example.com/reset?token=test123",
                    ...customData,
                });
                defaultSubject = "Reset your password";
                break;

            case "two-factor":
                emailTemplate = TwoFactor({
                    name: userName,
                    code: "123456",
                    ...customData,
                });
                defaultSubject = "Your verification code";
                break;

            case "welcome":
                emailTemplate = Welcome({
                    name: userName,
                    loginUrl: "https://example.com/login",
                    ...customData,
                });
                defaultSubject = "Welcome to our platform!";
                break;

            default:
                return { success: false, error: "Invalid template selected" };
        }

        await sendEmail({
            to,
            subject: subject || defaultSubject,
            html: await render(emailTemplate),
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send test email:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
