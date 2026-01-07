"use client";

import Link from "next/link";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/layout";
import { useTranslation, useLocale } from "@/lib/i18n";

export default function RegisterPage() {
    const { t } = useTranslation();
    const { locale } = useLocale();

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">{t("auth.register.title")}</h1>
                    <p className="text-sm text-muted-foreground">
                        {t("auth.register.description")}
                    </p>
                </div>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t("auth.register.name")}</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input id="name" type="text" placeholder="John Doe" className="pl-10" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">{t("auth.register.email")}</Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="password">{t("auth.register.password")}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            {t("auth.register.confirmPassword")}
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        {t("auth.register.submit")}
                        <ArrowRight className="ml-2 h-4 w-4" />
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
