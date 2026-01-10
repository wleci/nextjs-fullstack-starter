"use client";

import { createAuthClient } from "better-auth/react";
import { twoFactorClient, usernameClient } from "better-auth/client/plugins";

/**
 * Better Auth client instance for React
 * Provides hooks and methods for authentication in client components
 */
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    plugins: [
        usernameClient(),
        twoFactorClient(),
    ],
});

/**
 * Auth methods - Sign in/up/out
 */
export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession,
} = authClient;

/**
 * Session management
 */
export const {
    listSessions,
    revokeSession,
    revokeSessions,
    revokeOtherSessions,
} = authClient;

/**
 * User management
 */
export const {
    updateUser,
    changeEmail,
    changePassword,
    deleteUser,
} = authClient;

/**
 * Email verification
 */
export const {
    sendVerificationEmail,
} = authClient;

/**
 * Password reset - use authClient directly
 * authClient.forgetPassword() or authClient.resetPassword()
 */

/**
 * Two-factor authentication
 */
export const { twoFactor } = authClient;
