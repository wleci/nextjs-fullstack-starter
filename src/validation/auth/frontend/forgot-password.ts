import { z } from "zod";

/** Translation function type */
type TranslateFn = (key: string) => string;

/**
 * Create forgot password schema with translated messages
 * @param t - Translation function from useTranslation hook
 */
export function createForgotPasswordSchema(t: TranslateFn) {
    return z.object({
        email: z.string().email(t("validation.email.invalid")),
    });
}

/**
 * Forgot password schema with default English messages (for type inference)
 */
export const forgotPasswordSchema = createForgotPasswordSchema((key) => {
    const messages: Record<string, string> = {
        "validation.email.invalid": "Invalid email address",
    };
    return messages[key] ?? key;
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
