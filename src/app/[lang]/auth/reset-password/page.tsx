"use client";

import { useState } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/layout";
import { useTranslation } from "@/lib/i18n";
import { resetPasswordSchema, type ResetPasswordInput } from "@/validation";

export default function ResetPasswordPage() {
    const { t } = useTranslation();
    const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordInput, string>>>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            password: formData.get("password") as string,
            confirmPassword: formData.get("confirmPassword") as string,
        };

        const result = resetPasswordSchema.safeParse(data);
        if (!result.success) {
            const fieldErrors: typeof errors = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof ResetPasswordInput;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        // TODO: handle reset password
        console.log("Reset password:", result.data);
    };

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">{t("auth.resetPassword.title")}</h1>
                    <p className="text-sm text-muted-foreground">
                        {t("auth.resetPassword.description")}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">{t("auth.resetPassword.password")}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-xs text-destructive">{errors.password}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            {t("auth.resetPassword.confirmPassword")}
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full">
                        {t("auth.resetPassword.submit")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
}
