"use client";

import { useLocale, supportedLocales } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGUAGES: Record<string, { label: string; flag: string }> = {
    en: { label: "English", flag: "🇬🇧" },
    pl: { label: "Polski", flag: "🇵🇱" },
};

export function LanguageSwitcher() {
    const { locale, setLocale } = useLocale();
    const current = LANGUAGES[locale] ?? { label: locale, flag: "🌐" };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2" aria-label="Change language">
                    <span className="text-base">{current.flag}</span>
                    <span className="hidden sm:inline">{current.label}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {supportedLocales.map((lang) => {
                    const { label, flag } = LANGUAGES[lang] ?? { label: lang, flag: "🌐" };
                    return (
                        <DropdownMenuItem
                            key={lang}
                            onClick={() => setLocale(lang)}
                            className={locale === lang ? "bg-accent" : ""}
                        >
                            <span className="mr-2 text-base">{flag}</span>
                            {label}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
