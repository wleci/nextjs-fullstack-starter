import { z } from "zod";

/**
 * Sign-in with email - Frontend schema
 * Form validation with user-friendly messages
 */
export const signInEmailSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
});

/**
 * Sign-in with username - Frontend schema
 * Form validation with user-friendly messages
 */
export const signInUsernameSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
});

export type SignInEmailInput = z.infer<typeof signInEmailSchema>;
export type SignInUsernameInput = z.infer<typeof signInUsernameSchema>;
