import { z } from "zod";

/**
 * Forgot password - Backend schema
 * Used for /forgot-password endpoint
 */
export const forgotPasswordSchema = z.object({
    email: z.string().email(),
    redirectTo: z.string().url().optional(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
