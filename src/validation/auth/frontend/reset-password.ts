import { z } from "zod";

/**
 * Reset password - Frontend schema
 * Form validation with confirmPassword and user-friendly messages
 */
export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password must be at most 128 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
