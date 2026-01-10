import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";
import { twoFactor, username, captcha } from "better-auth/plugins";
import { localization } from "better-auth-localization";
import { validator } from "validation-better-auth";
import { render } from "@react-email/components";
import { db } from "@/lib/database";
import { env } from "@/lib/env";
import { sendEmail, ResetPassword, VerifyEmail, LoginNotification } from "@/lib/email";
import {
    signInEmailSchema,
    signUpSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    changeEmailSchema,
    updateProfileSchema,
    twoFactorVerifySchema,
} from "@/validation/auth/backend";
import * as authSchema from "./schema";

/** Supported locales by better-auth-localization plugin */
type LocalizationLocale =
    | "default"
    | "pl-PL"
    | "pt-BR"
    | "pt-PT"
    | "es-ES"
    | "de-DE"
    | "fr-FR"
    | "it-IT"
    | "ja-JP"
    | "ko-KR"
    | "zh-Hans"
    | "zh-Hant"
    | "ru-RU"
    | "tr-TR"
    | "nl-NL"
    | "sv-SE"
    | "ar-SA"
    | "ro-RO"
    | "mr-MR";

/** Map app locale to better-auth-localization code */
function mapLocaleToLocalization(locale: string): LocalizationLocale {
    const map: Record<string, LocalizationLocale> = {
        en: "default",
        pl: "pl-PL",
        pt: "pt-BR",
        es: "es-ES",
        de: "de-DE",
        fr: "fr-FR",
        it: "it-IT",
        ja: "ja-JP",
        ko: "ko-KR",
        zh: "zh-Hans",
        ru: "ru-RU",
        tr: "tr-TR",
        nl: "nl-NL",
        sv: "sv-SE",
        ar: "ar-SA",
        ro: "ro-RO",
    };
    return map[locale] ?? "default";
}

/**
 * Get supported locales from env
 */
function getSupportedLocales(): string[] {
    return env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(",").map((l) => l.trim());
}

/**
 * Get default locale from env, mapped to localization code
 */
function getDefaultLocale(): LocalizationLocale {
    return mapLocaleToLocalization(env.NEXT_PUBLIC_DEFAULT_LOCALE);
}

/**
 * Detect locale from request
 * Checks Accept-Language header and cookie
 */
function getLocaleFromRequest(request: Request | undefined): LocalizationLocale {
    const supportedLocales = getSupportedLocales();
    const fallback = getDefaultLocale();
    if (!request) return fallback;

    // Check cookie first
    const cookieHeader = request.headers.get("cookie") ?? "";
    const localeCookie = cookieHeader
        .split(";")
        .find((c) => c.trim().startsWith("NEXT_LOCALE="));
    if (localeCookie) {
        const locale = localeCookie.split("=")[1]?.trim();
        if (locale && supportedLocales.includes(locale)) {
            return mapLocaleToLocalization(locale);
        }
    }

    // Check Accept-Language header
    const acceptLanguage = request.headers.get("accept-language") ?? "";
    const preferredLocale = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase();
    if (preferredLocale && supportedLocales.includes(preferredLocale)) {
        return mapLocaleToLocalization(preferredLocale);
    }

    return fallback;
}

/**
 * Build social providers config dynamically
 * Only includes providers with valid credentials
 */
function buildSocialProviders() {
    const providers: Record<string, { clientId: string; clientSecret: string }> = {};

    if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
        providers.google = {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        };
    }

    if (env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET) {
        providers.discord = {
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
        };
    }

    return Object.keys(providers).length > 0 ? providers : undefined;
}

/**
 * Better Auth server instance
 * Full configuration with all authentication features
 */
export const auth = betterAuth({
    baseURL: env.NEXT_PUBLIC_APP_URL,
    secret: env.BETTER_AUTH_SECRET,

    advanced: {
        cookiePrefix: "auth",
    },

    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema: {
            user: authSchema.user,
            session: authSchema.session,
            account: authSchema.account,
            verification: authSchema.verification,
            twoFactor: authSchema.twoFactor,
        },
    }),

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        autoSignIn: false, // Don't auto sign in - require email verification first
        requireEmailVerification: true,

        /**
         * Send password reset email
         */
        sendResetPassword: async ({ user, url }) => {
            const html = await render(
                ResetPassword({
                    name: user.name ?? "User",
                    resetUrl: url,
                })
            );

            void sendEmail({
                to: user.email,
                subject: "Reset your password",
                html,
            });
        },
    },

    emailVerification: {
        sendOnSignUp: false, // User must manually request verification
        sendOnSignIn: false, // User must manually request verification
        autoSignInAfterVerification: true,

        /**
         * Send email verification
         */
        sendVerificationEmail: async ({ user, url }) => {
            const html = await render(
                VerifyEmail({
                    name: user.name ?? "User",
                    verifyUrl: url,
                })
            );

            void sendEmail({
                to: user.email,
                subject: "Verify your email",
                html,
            });
        },
    },

    socialProviders: buildSocialProviders(),

    /**
     * Auth hooks - send login notification email
     */
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            // Send login notification on successful sign-in
            if (ctx.path.startsWith("/sign-in") && ctx.context.newSession) {
                const { user } = ctx.context.newSession;

                // Get request info for email
                const ipAddress = ctx.request?.headers.get("x-forwarded-for")
                    ?? ctx.request?.headers.get("x-real-ip")
                    ?? undefined;
                const userAgent = ctx.request?.headers.get("user-agent") ?? undefined;
                const timestamp = new Date().toLocaleString("en-US", {
                    dateStyle: "full",
                    timeStyle: "short",
                });

                const html = await render(
                    LoginNotification({
                        name: user.name ?? "User",
                        ipAddress,
                        userAgent,
                        timestamp,
                    })
                );

                void sendEmail({
                    to: user.email,
                    subject: "New login to your account",
                    html,
                });
            }
        }),
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
        freshAge: 60 * 10, // 10 minutes (for sensitive operations)
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5, // 5 minutes
        },
    },

    user: {
        deleteUser: {
            enabled: true,
        },
        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async ({ user, newEmail, url }) => {
                const html = await render(
                    VerifyEmail({
                        name: user.name ?? "User",
                        verifyUrl: url,
                    })
                );

                void sendEmail({
                    to: newEmail,
                    subject: "Verify your new email",
                    html,
                });
            },
        },
    },

    rateLimit: {
        enabled: true,
        window: 60,
        max: 100,
        customRules: {
            "/sign-in/email": { window: 60, max: 5 },
            "/sign-in/username": { window: 60, max: 5 },
            "/sign-up/email": { window: 60, max: 3 },
            "/forgot-password": { window: 300, max: 3 },
            "/reset-password": { window: 300, max: 3 },
            "/two-factor/verify": { window: 60, max: 5 },
        },
    },

    plugins: [
        /**
         * Localization plugin - translates error messages
         * Detects locale from cookie (NEXT_LOCALE) or Accept-Language header
         * Falls back to NEXT_PUBLIC_DEFAULT_LOCALE from env
         */
        localization({
            defaultLocale: getDefaultLocale(),
            fallbackLocale: getDefaultLocale(),
            getLocale: (request) => getLocaleFromRequest(request),
        }),

        /**
         * Username plugin - allows login with username
         */
        username(),

        /**
         * Two-factor authentication plugin
         */
        twoFactor({
            issuer: env.APP_NAME,
            backupCodeCount: 10,
            backupCodeLength: 10,
        }),

        /**
         * Cloudflare Turnstile captcha - protects auth endpoints
         * Only enabled when TURNSTILE_SECRET_KEY is configured
         */
        ...(env.TURNSTILE_SECRET_KEY
            ? [
                captcha({
                    provider: "cloudflare-turnstile",
                    secretKey: env.TURNSTILE_SECRET_KEY,
                }),
            ]
            : []),

        /**
         * Request validation with Zod schemas
         */
        validator([
            { path: "/sign-up/email", schema: signUpSchema },
            { path: "/sign-in/email", schema: signInEmailSchema },
            { path: "/forgot-password", schema: forgotPasswordSchema },
            { path: "/reset-password", schema: resetPasswordSchema },
            { path: "/change-password", schema: changePasswordSchema },
            { path: "/change-email", schema: changeEmailSchema },
            { path: "/update-user", schema: updateProfileSchema },
            { path: "/two-factor/verify-totp", schema: twoFactorVerifySchema },
        ]),

        /**
         * Next.js cookies plugin - must be last
         */
        nextCookies(),
    ],
});

/**
 * Inferred types from Better Auth instance
 */
export type Auth = typeof auth;
export type AuthSession = typeof auth.$Infer.Session;
