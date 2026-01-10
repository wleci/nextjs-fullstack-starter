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
 * Create sign-in with username schema with translated messages
 * @param t - Translation function from useTranslation hook
 */
export function createSignInUsernameSchema(t: TranslateFn) {
    return z.object({
        username: z.string().min(1, t("validation.username.required")),
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

/**
 * Sign-in with username schema with default English messages (for type inference)
 */
export const signInUsernameSchema = createSignInUsernameSchema((key) => {
    const messages: Record<string, string> = {
        "validation.username.required": "Username is required",
        "validation.password.required": "Password is required",
    };
    return messages[key] ?? key;
});

export type SignInEmailInput = z.infer<typeof signInEmailSchema>;
export type SignInUsernameInput = z.infer<typeof signInUsernameSchema>;
