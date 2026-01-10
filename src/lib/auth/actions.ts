"use server";

import { auth } from "./server";

interface RequestPasswordResetResult {
    success: boolean;
    error?: string;
}

/**
 * Request password reset email
 * Server action using Better Auth API
 */
export async function requestPasswordReset(
    email: string,
    redirectTo: string
): Promise<RequestPasswordResetResult> {
    try {
        await auth.api.requestPasswordReset({
            body: {
                email,
                redirectTo,
            },
        });

        // Always return success to prevent email enumeration
        return { success: true };
    } catch {
        // Still return success to prevent email enumeration
        return { success: true };
    }
}
