import { z } from "zod";

/**
 * Change email - Frontend schema
 * Form validation with user-friendly messages
 */
export const changeEmailSchema = z.object({
    newEmail: z.string().email("Invalid email address"),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
