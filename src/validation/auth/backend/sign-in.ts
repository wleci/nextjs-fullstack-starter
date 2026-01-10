import { z } from "zod";

/**
 * Sign-in with email - Backend schema
 * Used for /sign-in/email endpoint
 */
export const signInEmailSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    rememberMe: z.boolean().optional(),
});

/**
 * Sign-in with username - Backend schema
 * Used for /sign-in/username endpoint
 */
export const signInUsernameSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
    rememberMe: z.boolean().optional(),
});

export type SignInEmailInput = z.infer<typeof signInEmailSchema>;
export type SignInUsernameInput = z.infer<typeof signInUsernameSchema>;
