"use client";

import { useLocale, supportedLocales } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { GB, PL } from 'country-flag-icons/react/3x2';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FLAGS: Record<string, React.ComponentType<{ className?: string }>> = {
    en: GB,
    pl: PL,
};

const LANGUAGES: Record<string, { label: string; code: string }> = {
    en: { label: "English", code: "EN" },
    pl: { label: "Polski", code: "PL" },
};

export function LanguageSwitcher() {
    const { locale, setLocale } = useLocale();
    const current = LANGUAGES[locale] ?? { label: locale, code: locale.toUpperCase() };
    const CurrentFlag = FLAGS[locale];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2" aria-label="Change language">
                    <Languages className="h-4 w-4" />
                    {CurrentFlag && <CurrentFlag className="h-4 w-5 rounded-sm border border-border/50" />}
                    <span className="hidden sm:inline font-medium">{current.code}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {supportedLocales.map((lang) => {
                    const { label } = LANGUAGES[lang] ?? { label: lang };
                    const Flag = FLAGS[lang];
                    return (
                        <DropdownMenuItem
                            key={lang}
                            onClick={() => setLocale(lang)}
                            className={locale === lang ? "bg-accent" : ""}
                        >
                            {Flag && <Flag className="mr-2 h-4 w-6 rounded-sm border border-border/50" />}
                            {label}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
