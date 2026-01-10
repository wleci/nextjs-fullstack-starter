import { z } from "zod";

/**
 * Enable 2FA - Backend schema
 * Used for /two-factor/enable endpoint
 */
export const twoFactorEnableSchema = z.object({
    password: z.string().min(1),
});

/**
 * Verify TOTP - Backend schema
 * Used for /two-factor/verify-totp endpoint
 */
export const twoFactorVerifySchema = z.object({
    code: z.string().length(6).regex(/^\d+$/),
});

/**
 * Disable 2FA - Backend schema
 * Used for /two-factor/disable endpoint
 */
export const twoFactorDisableSchema = z.object({
    password: z.string().min(1),
});

/**
 * Verify backup code - Backend schema
 * Used for /two-factor/verify-backup-code endpoint
 */
export const twoFactorBackupCodeSchema = z.object({
    code: z.string().min(1),
});

export type TwoFactorEnableInput = z.infer<typeof twoFactorEnableSchema>;
export type TwoFactorVerifyInput = z.infer<typeof twoFactorVerifySchema>;
export type TwoFactorDisableInput = z.infer<typeof twoFactorDisableSchema>;
export type TwoFactorBackupCodeInput = z.infer<typeof twoFactorBackupCodeSchema>;
