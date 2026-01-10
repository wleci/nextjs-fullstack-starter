import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { twoFactor, username } from "better-auth/plugins";
import { validator } from "validation-better-auth";
import { db } from "@/lib/database";
import { env } from "@/lib/env";
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
        autoSignIn: true,
        requireEmailVerification: false, // Set to true when email is configured

        /**
         * Send password reset email
         * @todo Implement email sending with your email service
         */
        sendResetPassword: async ({ user, url }) => {
            // TODO: Implement email sending
            console.log(`[Auth] Password reset requested for ${user.email}: ${url}`);
        },
    },

    emailVerification: {
        sendOnSignUp: false, // Set to true when email is configured
        autoSignInAfterVerification: true,

        /**
         * Send email verification
         * @todo Implement email sending with your email service
         */
        sendVerificationEmail: async ({ user, url }) => {
            // TODO: Implement email sending
            console.log(`[Auth] Verification email for ${user.email}: ${url}`);
        },
    },

    socialProviders: buildSocialProviders(),

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
                // TODO: Implement email sending
                console.log(`[Auth] Email change verification for ${user.email} -> ${newEmail}: ${url}`);
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
         * Captcha plugin - uncomment when configured
         * Supports: cloudflare-turnstile, recaptcha, hcaptcha
         *
         * import { captcha } from "better-auth/plugins";
         * captcha({
         *     provider: "cloudflare-turnstile",
         *     secretKey: env.TURNSTILE_SECRET_KEY!,
         * }),
         */

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
