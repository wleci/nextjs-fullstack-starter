import { z } from "zod";

/**
 * Update profile - Backend schema
 * Used for /update-user endpoint
 */
export const updateProfileSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    image: z.string().url().optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
