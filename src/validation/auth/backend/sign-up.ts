import { z } from "zod";

/**
 * Sign-up - Backend schema
 * Used for /sign-up/email endpoint
 */
export const signUpSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(128),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
