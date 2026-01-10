import { z } from "zod";

/**
 * Change password - Backend schema
 * Used for /change-password endpoint
 */
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(128),
    revokeOtherSessions: z.boolean().optional(),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
