"use client";

import { useTranslation } from "@/lib/i18n";

export default function SettingsPage() {
    const { t } = useTranslation();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">{t("dashboard.nav.settings")}</h1>
            <p className="mt-2 text-muted-foreground">Manage your account settings.</p>
        </div>
    );
}
