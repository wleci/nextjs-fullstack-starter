import { z } from "zod";

/**
 * Forgot password - Frontend schema
 * Form validation with user-friendly messages
 */
export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
