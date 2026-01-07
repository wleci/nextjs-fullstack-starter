import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().default("sqlite.db"),
        SMTP_HOST: z.string(),
        SMTP_PORT: z.coerce.number().default(587),
        SMTP_USER: z.string(),
        SMTP_PASSWORD: z.string(),
        SMTP_FROM: z.string().email(),
    },
    client: {
        NEXT_PUBLIC_APP_URL: z.string(),
        NEXT_PUBLIC_DEFAULT_LOCALE: z.string(),
        NEXT_PUBLIC_SUPPORTED_LOCALES: z.string(),
    },
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASSWORD: process.env.SMTP_PASSWORD,
        SMTP_FROM: process.env.SMTP_FROM,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
        NEXT_PUBLIC_SUPPORTED_LOCALES: process.env.NEXT_PUBLIC_SUPPORTED_LOCALES,
    },
});
