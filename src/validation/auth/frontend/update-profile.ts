import { z } from "zod";

/**
 * Update profile - Frontend schema
 * Form validation with user-friendly messages
 */
export const updateProfileSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be at most 100 characters")
        .optional(),
    image: z.string().url("Invalid image URL").optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
