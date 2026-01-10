"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle, Loader2, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout";
import { useTranslation, useLocale } from "@/lib/i18n";
import { authClient, useSession } from "@/lib/auth/client";

/** Cooldown time in seconds between resend attempts */
const RESEND_COOLDOWN = 60;

export default function VerifyEmailPage() {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const { data: session } = useSession();
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "verifying" | "verified" | "error">("idle");
    const [error, setError] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);
    const [pendingEmail, setPendingEmail] = useState<string | null>(null);

    // Get email from session or sessionStorage (for unverified users from login)
    const userEmail = session?.user?.email ?? pendingEmail;

    /**
     * Load pending email from sessionStorage on mount
     */
    useEffect(() => {
        const storedEmail = sessionStorage.getItem("pendingVerificationEmail");
        if (storedEmail) {
            setPendingEmail(storedEmail);
        }
    }, []);

    /**
     * Handle token verification when present in URL
     */
    const verifyToken = useCallback(async () => {
        if (!token) return;

        setStatus("verifying");
        setError(null);

        try {
            const response = await authClient.verifyEmail({
                query: { token },
            });

            if (response.error) {
                setError(response.error.message ?? t("errors.serverError"));
                setStatus("error");
                return;
            }

            // Clear pending email from storage
            sessionStorage.removeItem("pendingVerificationEmail");

            setStatus("verified");
            // Redirect to login after verification (user needs to log in again)
            setTimeout(() => {
                window.location.href = `/${locale}/auth/login`;
            }, 2000);
        } catch {
            setError(t("errors.serverError"));
            setStatus("error");
        }
    }, [token, locale, t]);

    useEffect(() => {
        verifyToken();
    }, [verifyToken]);

    /**
     * Cooldown timer effect
     */
    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    /**
     * Send verification email
     */
    const handleSendEmail = async () => {
        if (!userEmail || cooldown > 0) return;

        setStatus("sending");
        setError(null);

        try {
            const response = await authClient.sendVerificationEmail({
                email: userEmail,
                callbackURL: `/${locale}/auth/verify-email`,
            });

            if (response.error) {
                setError(response.error.message ?? t("errors.serverError"));
                setStatus("error");
                return;
            }

            setStatus("sent");
            setCooldown(RESEND_COOLDOWN);
        } catch {
            setError(t("errors.serverError"));
            setStatus("error");
        }
    };

    /**
     * Go back to login
     */
    const handleBackToLogin = () => {
        sessionStorage.removeItem("pendingVerificationEmail");
        window.location.href = `/${locale}/auth/login`;
    };

    // Show verification in progress
    if (token && status === "verifying") {
        return (
            <AuthLayout>
                <div className="space-y-6 text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                    <h1 className="text-2xl font-bold">{t("auth.verifyEmail.checking")}</h1>
                </div>
            </AuthLayout>
        );
    }

    // Show verification success
    if (status === "verified") {
        return (
            <AuthLayout>
                <div className="space-y-6 text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">{t("auth.verifyEmail.success")}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t("auth.verifyEmail.redirecting")}
                        </p>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    // No email available - redirect to login
    if (!userEmail && !token) {
        return (
            <AuthLayout>
                <div className="space-y-6 text-center">
                    <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">{t("auth.verifyEmail.title")}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t("auth.verifyEmail.noEmail")}
                        </p>
                    </div>
                    <Button onClick={handleBackToLogin} className="w-full">
                        {t("auth.verifyEmail.backToLogin")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </AuthLayout>
        );
    }

    // Main view - send verification email
    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h1 className="text-2xl font-bold">{t("auth.verifyEmail.title")}</h1>
                    <p className="text-sm text-muted-foreground">
                        {t("auth.verifyEmail.description")}
                    </p>
                    {userEmail && (
                        <p className="text-sm font-medium">{userEmail}</p>
                    )}
                </div>

                {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {status === "sent" && (
                    <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
                        {t("auth.verifyEmail.emailSent")}
                    </div>
                )}

                <div className="space-y-4">
                    <Button
                        onClick={handleSendEmail}
                        className="w-full"
                        disabled={status === "sending" || cooldown > 0}
                    >
                        {status === "sending" ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : cooldown > 0 ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                {t("auth.verifyEmail.resend")} ({cooldown}s)
                            </>
                        ) : (
                            <>
                                {t("auth.verifyEmail.resend")}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleBackToLogin}
                        className="w-full"
                    >
                        {t("auth.verifyEmail.useAnotherAccount")}
                    </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                    {t("auth.verifyEmail.checkSpam")}
                </p>
            </div>
        </AuthLayout>
    );
}
