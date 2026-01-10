import { z } from "zod";

/**
 * Resend verification email - Frontend schema
 * Form validation with user-friendly messages
 */
export const verifyEmailSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
