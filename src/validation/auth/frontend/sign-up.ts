import { z } from "zod";

/** Translation function type */
type TranslateFn = (key: string) => string;

/**
 * Create sign-up schema with translated messages
 * @param t - Translation function from useTranslation hook
 */
export function createSignUpSchema(t: TranslateFn) {
    return z
        .object({
            name: z
                .string()
                .min(2, t("validation.name.min"))
                .max(100, t("validation.name.max")),
            email: z.string().email(t("validation.email.invalid")),
            password: z
                .string()
                .min(8, t("validation.password.min"))
                .max(128, t("validation.password.max")),
            confirmPassword: z.string(),
            username: z
                .string()
                .min(3, t("validation.username.min"))
                .max(30, t("validation.username.max"))
                .regex(/^[a-zA-Z0-9_-]+$/, t("validation.username.invalid"))
                .optional(),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t("validation.confirmPassword.mismatch"),
            path: ["confirmPassword"],
        });
}

/**
 * Sign-up schema with default English messages (for type inference)
 */
export const signUpSchema = createSignUpSchema((key) => {
    const messages: Record<string, string> = {
        "validation.name.min": "Name must be at least 2 characters",
        "validation.name.max": "Name must be at most 100 characters",
        "validation.email.invalid": "Invalid email address",
        "validation.password.min": "Password must be at least 8 characters",
        "validation.password.max": "Password must be at most 128 characters",
        "validation.username.min": "Username must be at least 3 characters",
        "validation.username.max": "Username must be at most 30 characters",
        "validation.username.invalid": "Username can only contain letters, numbers, underscores and hyphens",
        "validation.confirmPassword.mismatch": "Passwords don't match",
    };
    return messages[key] ?? key;
});

export type SignUpInput = z.infer<typeof signUpSchema>;
