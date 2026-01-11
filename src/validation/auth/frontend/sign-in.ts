import { z } from "zod";

/** Translation function type */
type TranslateFn = (key: string) => string;

/**
 * Create sign-in with email schema with translated messages
 * @param t - Translation function from useTranslation hook
 */
export function createSignInEmailSchema(t: TranslateFn) {
    return z.object({
        email: z.string().email(t("validation.email.invalid")),
        password: z.string().min(1, t("validation.password.required")),
        rememberMe: z.boolean().optional(),
    });
}

/**
 * Sign-in with email schema with default English messages (for type inference)
 */
export const signInEmailSchema = createSignInEmailSchema((key) => {
    const messages: Record<string, string> = {
        "validation.email.invalid": "Invalid email address",
        "validation.password.required": "Password is required",
    };
    return messages[key] ?? key;
});

export type SignInEmailInput = z.infer<typeof signInEmailSchema>;
