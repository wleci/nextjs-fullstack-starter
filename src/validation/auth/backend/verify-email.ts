import { z } from "zod";

/**
 * Send verification email - Backend schema
 * Used for /send-verification-email endpoint
 */
export const verifyEmailSchema = z.object({
    email: z.string().email(),
    callbackURL: z.string().optional(),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
