"use client";

import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/layout";
import { useTranslation } from "@/lib/i18n";

export default function ResetPasswordPage() {
    const { t } = useTranslation();

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">{t("auth.resetPassword.title")}</h1>
                    <p className="text-sm text-muted-foreground">
                        {t("auth.resetPassword.description")}
                    </p>
                </div>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">{t("auth.resetPassword.password")}</Label>
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
                            {t("auth.resetPassword.confirmPassword")}
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
                        {t("auth.resetPassword.submit")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
}
