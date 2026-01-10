import { z } from "zod";

/**
 * Change password - Frontend schema
 * Form validation with confirmPassword and user-friendly messages
 */
export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password must be at most 128 characters"),
        confirmPassword: z.string(),
        revokeOtherSessions: z.boolean().optional(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
