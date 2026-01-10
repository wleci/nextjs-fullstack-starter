import { z } from "zod";

/**
 * Reset password - Backend schema
 * Used for /reset-password endpoint
 */
export const resetPasswordSchema = z.object({
    newPassword: z.string().min(8).max(128),
    token: z.string().min(1),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
