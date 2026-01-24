import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const booleanString = z
    .string()
    .default("false")
    .transform((val) => val === "true");

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().default("sqlite.db"),

        // Better Auth
        BETTER_AUTH_SECRET: z.string().min(32),
        APP_NAME: z.string().default("My App"),

        // OAuth - Google
        GOOGLE_CLIENT_ID: z.string().optional(),
        GOOGLE_CLIENT_SECRET: z.string().optional(),

        // OAuth - Discord
        DISCORD_CLIENT_ID: z.string().optional(),
        DISCORD_CLIENT_SECRET: z.string().optional(),

        // Captcha (optional)
        TURNSTILE_SECRET_KEY: z.string().optional(),

        // Email (SMTP)
        SMTP_HOST: z.string(),
        SMTP_PORT: z.coerce.number().default(587),
        SMTP_USER: z.string(),
        SMTP_PASSWORD: z.string(),
        SMTP_FROM: z.string().email(),
    },
    client: {
        NEXT_PUBLIC_APP_URL: z.string(),
        NEXT_PUBLIC_APP_NAME: z.string().default("Wleci Panel"),
        NEXT_PUBLIC_DEFAULT_LOCALE: z.string(),
        NEXT_PUBLIC_SUPPORTED_LOCALES: z.string(),

        // Feature flags
        NEXT_PUBLIC_ENABLE_GOOGLE: booleanString,
        NEXT_PUBLIC_ENABLE_DISCORD: booleanString,
        NEXT_PUBLIC_ENABLE_CAPTCHA: booleanString,
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),

        // Feature flags
        NEXT_PUBLIC_ENABLE_BLOG: booleanString,
        NEXT_PUBLIC_ENABLE_EMAIL: booleanString,
        NEXT_PUBLIC_ENABLE_NEWSLETTER: booleanString,
        NEXT_PUBLIC_ENABLE_DATABASE_MANAGEMENT: booleanString,
    },
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        APP_NAME: process.env.APP_NAME,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
        DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
        TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASSWORD: process.env.SMTP_PASSWORD,
        SMTP_FROM: process.env.SMTP_FROM,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
        NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
        NEXT_PUBLIC_SUPPORTED_LOCALES: process.env.NEXT_PUBLIC_SUPPORTED_LOCALES,
        NEXT_PUBLIC_ENABLE_GOOGLE: process.env.NEXT_PUBLIC_ENABLE_GOOGLE,
        NEXT_PUBLIC_ENABLE_DISCORD: process.env.NEXT_PUBLIC_ENABLE_DISCORD,
        NEXT_PUBLIC_ENABLE_CAPTCHA: process.env.NEXT_PUBLIC_ENABLE_CAPTCHA,
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        NEXT_PUBLIC_ENABLE_BLOG: process.env.NEXT_PUBLIC_ENABLE_BLOG,
        NEXT_PUBLIC_ENABLE_EMAIL: process.env.NEXT_PUBLIC_ENABLE_EMAIL,
        NEXT_PUBLIC_ENABLE_NEWSLETTER: process.env.NEXT_PUBLIC_ENABLE_NEWSLETTER,
        NEXT_PUBLIC_ENABLE_DATABASE_MANAGEMENT: process.env.NEXT_PUBLIC_ENABLE_DATABASE_MANAGEMENT,
    },
});
