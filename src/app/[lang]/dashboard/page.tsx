"use client";

import { useTranslation } from "@/lib/i18n";

export default function DashboardPage() {
    const { t } = useTranslation();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">{t("dashboard.home.title")}</h1>
            <p className="mt-2 text-muted-foreground">{t("dashboard.home.welcome")}</p>
        </div>
    );
}
