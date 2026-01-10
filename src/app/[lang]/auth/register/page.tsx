"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Turnstile, isTurnstileEnabled } from "@/components/ui/turnstile";
import { AuthLayout } from "@/components/layout";
import { useTranslation, useLocale } from "@/lib/i18n";
import { createSignUpSchema, type SignUpInput } from "@/validation/auth/frontend/sign-up";
import { signUp } from "@/lib/auth/client";

export default function RegisterPage() {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const [errors, setErrors] = useState<Partial<Record<keyof SignUpInput, string>>>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const registerSchema = createSignUpSchema(t);
    const captchaEnabled = isTurnstileEnabled();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setServerError(null);

        if (captchaEnabled && !captchaToken) {
            setServerError(t("errors.captchaRequired"));
            return;
        }

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            confirmPassword: formData.get("confirmPassword") as string,
        };

        const result = registerSchema.safeParse(data);
        if (!result.success) {
            const fieldErrors: typeof errors = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof SignUpInput;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        try {
            const response = await signUp.email({
                name: result.data.name,
                email: result.data.email,
                password: result.data.password,
                fetchOptions: captchaToken
                    ? { headers: { "x-captcha-response": captchaToken } }
                    : undefined,
            });

            if (response.error) {
                setServerError(response.error.message ?? t("errors.serverError"));
                return;
            }

            window.location.href = `/${locale}/dashboard`;
        } catch {
            setServerError(t("errors.serverError"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">{t("auth.register.title")}</h1>
                    <p className="text-sm text-muted-foreground">
                        {t("auth.register.description")}
                    </p>
                </div>

                {serverError && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t("auth.register.name")}</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                className="pl-10"
                                disabled={isLoading}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-xs text-destructive">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">{t("auth.register.email")}</Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="password">{t("auth.register.password")}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                                disabled={isLoading}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-xs text-destructive">{errors.password}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            {t("auth.register.confirmPassword")}
                        </Label>
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

                    <Turnstile onSuccess={setCaptchaToken} />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                {t("auth.register.submit")}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>

                <p className="text-center text-xs text-muted-foreground">
                    {t("auth.register.terms")}{" "}
                    <Link
                        href={`/${locale}/terms`}
                        className="text-primary hover:underline"
                    >
                        {t("common.terms")}
                    </Link>
                </p>

                <p className="text-center text-sm text-muted-foreground">
                    {t("auth.register.hasAccount")}{" "}
                    <Link
                        href={`/${locale}/auth/login`}
                        className="font-medium text-primary hover:underline"
                    >
                        {t("auth.register.login")}
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
