"use client";

import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/layout";
import { useTranslation, useLocale } from "@/lib/i18n";

export default function ForgotPasswordPage() {
    const { t } = useTranslation();
    const { locale } = useLocale();

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">{t("auth.forgotPassword.title")}</h1>
                    <p className="text-sm text-muted-foreground">
                        {t("auth.forgotPassword.description")}
                    </p>
                </div>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">{t("auth.forgotPassword.email")}</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        {t("auth.forgotPassword.submit")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>

                <Link
                    href={`/${locale}/auth/login`}
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {t("auth.forgotPassword.backToLogin")}
                </Link>
            </div>
        </AuthLayout>
    );
}
