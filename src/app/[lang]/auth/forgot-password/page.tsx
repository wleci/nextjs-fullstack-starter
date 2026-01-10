"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/layout";
import { useTranslation, useLocale } from "@/lib/i18n";
import { createForgotPasswordSchema, type ForgotPasswordInput } from "@/validation/auth/frontend/forgot-password";
import { requestPasswordReset } from "@/lib/auth/actions";

export default function ForgotPasswordPage() {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const [errors, setErrors] = useState<Partial<Record<keyof ForgotPasswordInput, string>>>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const forgotPasswordSchema = createForgotPasswordSchema(t);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setServerError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            email: formData.get("email") as string,
        };

        const result = forgotPasswordSchema.safeParse(data);
        if (!result.success) {
            const fieldErrors: typeof errors = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof ForgotPasswordInput;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        try {
            const response = await requestPasswordReset(
                result.data.email,
                `/${locale}/auth/reset-password`
            );

            if (!response.success) {
                setServerError(response.error ?? t("errors.serverError"));
                return;
            }

            setIsSuccess(true);
        } catch {
            setServerError(t("errors.serverError"));
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <AuthLayout>
                <div className="space-y-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">{t("auth.forgotPassword.title")}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t("auth.forgotPassword.success")}
                        </p>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                        <Link href={`/${locale}/auth/login`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t("auth.forgotPassword.backToLogin")}
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
                    <h1 className="text-2xl font-bold">{t("auth.forgotPassword.title")}</h1>
                    <p className="text-sm text-muted-foreground">
                        {t("auth.forgotPassword.description")}
                    </p>
                </div>

                {serverError && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">{t("auth.forgotPassword.email")}</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                className="pl-10"
                                disabled={isLoading}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-destructive">{errors.email}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                {t("auth.forgotPassword.submit")}
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
