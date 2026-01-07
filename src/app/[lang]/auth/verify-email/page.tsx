"use client";

import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout";
import { useTranslation, useLocale } from "@/lib/i18n";

export default function VerifyEmailPage() {
    const { t } = useTranslation();
    const { locale } = useLocale();

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">{t("auth.verifyEmail.title")}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t("auth.verifyEmail.description")}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                        {t("auth.verifyEmail.resend")}
                    </Button>

                    <Link href={`/${locale}/auth/login`}>
                        <Button variant="ghost" className="w-full">
                            {t("auth.login.submit")}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
