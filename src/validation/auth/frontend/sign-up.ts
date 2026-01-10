import { z } from "zod";

/**
 * Sign-up - Frontend schema
 * Form validation with confirmPassword and user-friendly messages
 */
export const signUpSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must be at most 100 characters"),
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password must be at most 128 characters"),
        confirmPassword: z.string(),
        username: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(30, "Username must be at most 30 characters")
            .regex(
                /^[a-zA-Z0-9_-]+$/,
                "Username can only contain letters, numbers, underscores and hyphens"
            )
            .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export type SignUpInput = z.infer<typeof signUpSchema>;
