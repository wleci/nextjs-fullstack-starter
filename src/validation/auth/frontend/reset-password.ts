import { z } from "zod";

/** Translation function type */
type TranslateFn = (key: string) => string;

/**
 * Create reset password schema with translated messages
 * @param t - Translation function from useTranslation hook
 */
export function createResetPasswordSchema(t: TranslateFn) {
    return z
        .object({
            newPassword: z
                .string()
                .min(8, t("validation.password.min"))
                .max(128, t("validation.password.max")),
            confirmPassword: z.string(),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: t("validation.confirmPassword.mismatch"),
            path: ["confirmPassword"],
        });
}

/**
 * Reset password schema with default English messages (for type inference)
 */
export const resetPasswordSchema = createResetPasswordSchema((key) => {
    const messages: Record<string, string> = {
        "validation.password.min": "Password must be at least 8 characters",
        "validation.password.max": "Password must be at most 128 characters",
        "validation.confirmPassword.mismatch": "Passwords don't match",
    };
    return messages[key] ?? key;
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
