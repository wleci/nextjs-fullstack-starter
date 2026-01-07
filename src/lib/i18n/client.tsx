"use client";

import {
    createContext,
    useContext,
    useCallback,
    useState,
    useMemo,
    useTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
    COOKIE_NAME,
    COOKIE_MAX_AGE,
    defaultLocale,
    isValidLocale,
} from "./config";

type Translations = Record<string, unknown>;

interface I18nContextType {
    locale: string;
    setLocale: (locale: string) => void;
    t: (key: string) => string;
    isPending: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

interface I18nProviderProps {
    children: React.ReactNode;
    locale: string;
    translations: Translations;
}

export function I18nProvider({
    children,
    locale: initialLocale,
    translations: initialTranslations,
}: I18nProviderProps) {
    const [locale, setLocaleState] = useState(initialLocale);
    const [translations, setTranslations] =
        useState<Translations>(initialTranslations);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const setLocale = useCallback(
        (newLocale: string) => {
            const validLocale = isValidLocale(newLocale) ? newLocale : defaultLocale;

            document.cookie = `${COOKIE_NAME}=${validLocale}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;

            startTransition(async () => {
                try {
                    const newTranslations = await import(
                        `./dictionaries/${validLocale}.json`
                    );
                    setTranslations(newTranslations.default || newTranslations);
                    setLocaleState(validLocale);

                    const currentPath = window.location.pathname;
                    const pathWithoutLocale =
                        currentPath.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
                    router.push(`/${validLocale}${pathWithoutLocale}`);
                } catch {
                    console.error(`Failed to load translations for ${validLocale}`);
                }
            });
        },
        [router]
    );

    const t = useCallback(
        (key: string): string => {
            const keys = key.split(".");
            let result: unknown = translations;

            for (const k of keys) {
                if (result && typeof result === "object" && k in result) {
                    result = (result as Record<string, unknown>)[k];
                } else {
                    return key;
                }
            }

            return typeof result === "string" ? result : key;
        },
        [translations]
    );

    const value = useMemo(
        () => ({ locale, setLocale, t, isPending }),
        [locale, setLocale, t, isPending]
    );

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error("useI18n must be used within I18nProvider");
    }
    return context;
}

export function useLocale() {
    const { locale, setLocale } = useI18n();
    return { locale, setLocale };
}

export function useTranslation() {
    const { t, isPending } = useI18n();
    return { t, isPending };
}
