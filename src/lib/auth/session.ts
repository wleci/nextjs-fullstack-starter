import { headers } from "next/headers";
import { auth } from "./server";

/**
 * Get current session in Server Components
 * @returns Session object or null if not authenticated
 */
export async function getServerSession() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return session;
}

/**
 * Get current user in Server Components
 * @returns User object or null if not authenticated
 */
export async function getServerUser() {
    const session = await getServerSession();
    return session?.user ?? null;
}

/**
 * Check if user is authenticated in Server Components
 * @returns boolean
 */
export async function isAuthenticated() {
    const session = await getServerSession();
    return session !== null;
}

/**
 * Check if user has verified email
 * @returns boolean
 */
export async function isEmailVerified() {
    const session = await getServerSession();
    return session?.user?.emailVerified ?? false;
}

/**
 * Check if user has 2FA enabled
 * @returns boolean
 */
export async function hasTwoFactorEnabled() {
    const session = await getServerSession();
    return session?.user?.twoFactorEnabled ?? false;
}
