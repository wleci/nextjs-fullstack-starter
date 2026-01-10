"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, ArrowLeft, ArrowRight, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/layout";
import { useTranslation, useLocale } from "@/lib/i18n";
import { createResetPasswordSchema, type ResetPasswordInput } from "@/validation/auth/frontend/reset-password";
import { authClient } from "@/lib/auth/client";

export default function ResetPasswordPage() {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const searchParams = useSearchParams();
    const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordInput, string>>>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isInvalidToken, setIsInvalidToken] = useState(false);

    const token = searchParams.get("token");
    const error = searchParams.get("error");

    const resetPasswordSchema = createResetPasswordSchema(t);

    useEffect(() => {
        if (error === "INVALID_TOKEN" || !token) {
            setIsInvalidToken(true);
        }
    }, [error, token]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setServerError(null);

        if (!token) {
            setIsInvalidToken(true);
            return;
        }

        const formData = new FormData(e.currentTarget);
        const data = {
            newPassword: formData.get("newPassword") as string,
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
        setIsLoading(true);

        try {
            const response = await authClient.resetPassword({
                newPassword: result.data.newPassword,
                token,
            });

            if (response.error) {
                setServerError(response.error.message ?? t("errors.serverError"));
                return;
            }

            setIsSuccess(true);
        } catch {
            setServerError(t("errors.serverError"));
        } finally {
            setIsLoading(false);
        }
    };

    if (isInvalidToken) {
        return (
            <AuthLayout>
                <div className="space-y-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <XCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">{t("auth.resetPassword.invalidToken")}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t("auth.resetPassword.invalidTokenDescription")}
                        </p>
                    </div>
                    <Button asChild className="w-full">
                        <Link href={`/${locale}/auth/forgot-password`}>
                            {t("auth.resetPassword.requestNewLink")}
                        </Link>
                    </Button>
                </div>
            </AuthLayout>
        );
    }

    if (isSuccess) {
        return (
            <AuthLayout>
                <div className="space-y-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">{t("auth.resetPassword.title")}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t("auth.resetPassword.success")}
                        </p>
                    </div>
                    <Button asChild className="w-full">
                        <Link href={`/${locale}/auth/login`}>
                            {t("auth.resetPassword.backToLogin")}
                        </Link>
                    </Button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">{t("auth.resetPassword.title")}</h1>
                    <p className="text-sm text-muted-foreground">
                        {t("auth.resetPassword.description")}
                    </p>
                </div>

                {serverError && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">{t("auth.resetPassword.password")}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                                disabled={isLoading}
                            />
                        </div>
                        {errors.newPassword && (
                            <p className="text-xs text-destructive">{errors.newPassword}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">{t("auth.resetPassword.confirmPassword")}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                                disabled={isLoading}
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                {t("auth.resetPassword.submit")}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    <Link
                        href={`/${locale}/auth/login`}
                        className="font-medium text-primary hover:underline inline-flex items-center"
                    >
                        <ArrowLeft className="mr-1 h-3 w-3" />
                        {t("auth.forgotPassword.backToLogin")}
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
