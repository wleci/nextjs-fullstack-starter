import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().default("sqlite.db"),
    },
    client: {
        NEXT_PUBLIC_APP_URL: z.string(),
        NEXT_PUBLIC_DEFAULT_LOCALE: z.string(),
        NEXT_PUBLIC_SUPPORTED_LOCALES: z.string(),
    },
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
        NEXT_PUBLIC_SUPPORTED_LOCALES: process.env.NEXT_PUBLIC_SUPPORTED_LOCALES,
    },
});
