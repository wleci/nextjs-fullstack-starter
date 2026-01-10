import { z } from "zod";

/**
 * Delete account - Backend schema
 * Used for /delete-user endpoint
 */
export const deleteAccountSchema = z.object({
    password: z.string().optional(),
    callbackURL: z.string().optional(),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
