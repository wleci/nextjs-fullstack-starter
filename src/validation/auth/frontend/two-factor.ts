import { z } from "zod";

/**
 * Enable 2FA - Frontend schema
 * Form validation with user-friendly messages
 */
export const twoFactorEnableSchema = z.object({
    password: z.string().min(1, "Password is required"),
});

/**
 * Verify TOTP - Frontend schema
 * Form validation with user-friendly messages
 */
export const twoFactorVerifySchema = z.object({
    code: z
        .string()
        .length(6, "Code must be 6 digits")
        .regex(/^\d+$/, "Code must contain only digits"),
});

/**
 * Disable 2FA - Frontend schema
 * Form validation with user-friendly messages
 */
export const twoFactorDisableSchema = z.object({
    password: z.string().min(1, "Password is required"),
});

/**
 * Verify backup code - Frontend schema
 * Form validation with user-friendly messages
 */
export const twoFactorBackupCodeSchema = z.object({
    code: z.string().min(1, "Backup code is required"),
});

export type TwoFactorEnableInput = z.infer<typeof twoFactorEnableSchema>;
export type TwoFactorVerifyInput = z.infer<typeof twoFactorVerifySchema>;
export type TwoFactorDisableInput = z.infer<typeof twoFactorDisableSchema>;
export type TwoFactorBackupCodeInput = z.infer<typeof twoFactorBackupCodeSchema>;
