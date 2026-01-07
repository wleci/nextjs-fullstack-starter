"use client";

import { Ban, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout";
import { useTranslation } from "@/lib/i18n";

export default function BannedPage() {
    const { t } = useTranslation();

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <Ban className="h-6 w-6 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">{t("auth.banned.title")}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t("auth.banned.description")}
                        </p>
                    </div>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                    {t("auth.banned.contact")}
                </p>

                <Button variant="outline" className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    {t("auth.banned.support")}
                </Button>
            </div>
        </AuthLayout>
    );
}
