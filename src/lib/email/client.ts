import nodemailer from "nodemailer";
import { env } from "@/lib/env";

export const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
    },
});

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
    return transporter.sendMail({
        from: env.SMTP_FROM,
        to,
        subject,
        html,
    });
}
