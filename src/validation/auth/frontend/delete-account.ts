import { z } from "zod";

/**
 * Delete account - Frontend schema
 * Form validation with user-friendly messages
 */
export const deleteAccountSchema = z.object({
    password: z.string().min(1, "Password is required"),
    confirmation: z.literal("DELETE", {
        errorMap: () => ({ message: "Please type DELETE to confirm" }),
    }),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
