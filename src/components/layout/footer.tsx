"use client";

import { useTranslation } from "@/lib/i18n";

export function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-center px-6">
                <p className="text-sm text-muted-foreground">{t("footer.stack")}</p>
            </div>
        </footer>
    );
}
