"use client";

import Link from "next/link";
import { LogOut, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout";
import { useTranslation, useLocale } from "@/lib/i18n";

export default function LogoutPage() {
    const { t } = useTranslation();
    const { locale } = useLocale();

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <LogOut className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">{t("auth.logout.title")}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t("auth.logout.description")}
                        </p>
                    </div>
                </div>

                <Link href={`/${locale}/auth/login`}>
                    <Button className="w-full">
                        {t("auth.logout.login")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </AuthLayout>
    );
}
