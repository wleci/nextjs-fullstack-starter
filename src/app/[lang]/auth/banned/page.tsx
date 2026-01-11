"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ban, Mail, ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthLayout } from "@/components/layout";
import { useTranslation, useLocale } from "@/lib/i18n";

export default function BannedPage() {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const [banReason, setBanReason] = useState<string | null>(null);

    useEffect(() => {
        // Get ban reason from sessionStorage (set during login redirect)
        const reason = sessionStorage.getItem("banReason");
        if (reason) {
            setBanReason(reason);
            sessionStorage.removeItem("banReason");
        }
    }, []);

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                        <Ban className="h-8 w-8 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">{t("auth.banned.title")}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t("auth.banned.description")}
                        </p>
                    </div>
                </div>

                {banReason && (
                    <Card className="border-destructive/50 bg-destructive/5">
                        <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-destructive">
                                        {t("auth.banned.reason")}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {banReason}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <p className="text-center text-sm text-muted-foreground">
                    {t("auth.banned.contact")}
                </p>

                <div className="space-y-3">
                    <Button variant="outline" className="w-full" asChild>
                        <a href="mailto:support@example.com">
                            <Mail className="mr-2 h-4 w-4" />
                            {t("auth.banned.support")}
                        </a>
                    </Button>

                    <Button variant="ghost" className="w-full" asChild>
                        <Link href={`/${locale}/auth/login`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t("auth.banned.backToLogin")}
                        </Link>
                    </Button>
                </div>
            </div>
        </AuthLayout>
    );
}
