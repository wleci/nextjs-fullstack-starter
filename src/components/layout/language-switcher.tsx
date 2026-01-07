"use client";

import { useLocale, supportedLocales } from "@/lib/i18n";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANG_LABELS: Record<string, string> = {
    en: "English",
    pl: "Polski",
};

export function LanguageSwitcher() {
    const { locale, setLocale } = useLocale();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Change language">
                    <Languages className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {supportedLocales.map((lang) => (
                    <DropdownMenuItem
                        key={lang}
                        onClick={() => setLocale(lang)}
                        className={locale === lang ? "bg-accent" : ""}
                    >
                        {LANG_LABELS[lang] ?? lang.toUpperCase()}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
