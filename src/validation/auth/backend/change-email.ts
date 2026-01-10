import { z } from "zod";

/**
 * Change email - Backend schema
 * Used for /change-email endpoint
 */
export const changeEmailSchema = z.object({
    newEmail: z.string().email(),
    callbackURL: z.string().optional(),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
