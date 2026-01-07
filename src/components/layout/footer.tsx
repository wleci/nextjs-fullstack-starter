"use client";

import Link from "next/link";
import { useTranslation, useLocale } from "@/lib/i18n";

export function Footer() {
    const { t } = useTranslation();
    const { locale } = useLocale();

    return (
        <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-6">
                <p className="text-sm text-muted-foreground">{t("footer.stack")}</p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                    <Link href={`/${locale}/privacy`} className="hover:text-foreground">
                        {t("common.privacy")}
                    </Link>
                    <Link href={`/${locale}/terms`} className="hover:text-foreground">
                        {t("common.terms")}
                    </Link>
                    <Link href={`/${locale}/cookies`} className="hover:text-foreground">
                        {t("common.cookies")}
                    </Link>
                </div>
            </div>
        </footer>
    );
}
