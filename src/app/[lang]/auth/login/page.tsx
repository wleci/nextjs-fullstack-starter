"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Turnstile, isTurnstileEnabled, type TurnstileRef } from "@/components/ui/turnstile";
import { SocialLogin, isSocialLoginEnabled } from "@/components/ui/social-login";
import { AuthLayout } from "@/components/layout";
import { useTranslation, useLocale } from "@/lib/i18n";
import { createSignInEmailSchema, type SignInEmailInput } from "@/validation/auth/frontend/sign-in";
import { signIn } from "@/lib/auth/client";

export default function LoginPage() {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const [errors, setErrors] = useState<Partial<Record<keyof SignInEmailInput, string>>>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileRef>(null);

    const loginSchema = createSignInEmailSchema(t);
    const captchaEnabled = isTurnstileEnabled();

    /** Reset captcha after failed login */
    const resetCaptcha = () => {
        setCaptchaToken(null);
        turnstileRef.current?.reset();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setServerError(null);
        setIsLocked(false);

        if (captchaEnabled && !captchaToken) {
            setServerError(t("errors.captchaRequired"));
            return;
        }

        const formData = new FormData(e.currentTarget);
        const data = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        };

        const result = loginSchema.safeParse(data);
        if (!result.success) {
            const fieldErrors: typeof errors = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof SignInEmailInput;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        try {
            const response = await signIn.email({
                email: result.data.email,
                password: result.data.password,
                fetchOptions: captchaToken
                    ? { headers: { "x-captcha-response": captchaToken } }
                    : undefined,
            });

            if (response.error) {
                // Debug: log error details
                console.log("Login error:", {
                    status: response.error.status,
                    code: response.error.code,
                    message: response.error.message,
                });

                const errorMessage = response.error.message ?? "";
                const errorCode = response.error.code ?? "";

                // Reset captcha on any error
                resetCaptcha();

                // Check if account is locked (check first)
                if (errorMessage.toLowerCase().includes("locked")) {
                    setIsLocked(true);
                    setServerError(errorMessage);
                    return;
                }

                // Check if user is banned
                if (errorCode === "USER_BANNED" ||
                    errorMessage.toLowerCase().includes("banned") ||
                    errorMessage.toLowerCase().includes("suspended")) {
                    // Store ban reason in sessionStorage for banned page
                    sessionStorage.setItem("banReason", errorMessage);
                    window.location.href = `/${locale}/auth/banned`;
                    return;
                }

                // Check if error is due to unverified email
                // Better Auth returns 403 with specific message for unverified email
                if (errorCode === "EMAIL_NOT_VERIFIED" ||
                    errorMessage.toLowerCase().includes("verify your email") ||
                    errorMessage.toLowerCase().includes("email is not verified")) {
                    sessionStorage.setItem("pendingVerificationEmail", result.data.email);
                    window.location.href = `/${locale}/auth/verify-email`;
                    return;
                }

                setServerError(errorMessage || t("errors.serverError"));
                return;
            }

            window.location.href = `/${locale}/dashboard`;
        } catch {
            resetCaptcha();
            setServerError(t("errors.serverError"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">{t("auth.login.title")}</h1>
                    <p className="text-sm text-muted-foreground">
                        {t("auth.login.description")}
                    </p>
                </div>

                {serverError && (
                    <div className={`rounded-md p-3 text-sm ${isLocked ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-destructive/10 text-destructive"}`}>
                        {isLocked && <ShieldAlert className="inline-block mr-2 h-4 w-4" />}
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">{t("auth.login.email")}</Label>
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
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">{t("auth.login.password")}</Label>
                            <Link
                                href={`/${locale}/auth/forgot-password`}
                                className="text-xs text-muted-foreground hover:text-primary"
                            >
                                {t("auth.login.forgotPassword")}
                            </Link>
                        </div>
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

                    <Turnstile ref={turnstileRef} onSuccess={setCaptchaToken} />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                {t("auth.login.submit")}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>

                {isSocialLoginEnabled() && (
                    <>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    {t("common.or")}
                                </span>
                            </div>
                        </div>

                        <SocialLogin
                            callbackURL={`/${locale}/dashboard`}
                            disabled={isLoading}
                        />
                    </>
                )}

                <p className="text-center text-sm text-muted-foreground">
                    {t("auth.login.noAccount")}{" "}
                    <Link
                        href={`/${locale}/auth/register`}
                        className="font-medium text-primary hover:underline"
                    >
                        {t("auth.login.register")}
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
