import { z } from "zod";

export const twoFactorSchema = z.object({
    code: z.string().length(6, "Code must be 6 digits"),
});

export const backupCodeSchema = z.object({
    code: z.string().min(8, "Invalid backup code"),
});

export type TwoFactorInput = z.infer<typeof twoFactorSchema>;
export type BackupCodeInput = z.infer<typeof backupCodeSchema>;
