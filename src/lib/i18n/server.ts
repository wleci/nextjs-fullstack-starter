import "server-only";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { COOKIE_NAME, defaultLocale, isValidLocale } from "./config";

type Translations = Record<string, unknown>;

const translationsCache = new Map<string, Translations>();

export const getLocale = cache(async (): Promise<string> => {
    const cookieStore = await cookies();
    const langCookie = cookieStore.get(COOKIE_NAME)?.value;

    if (langCookie && isValidLocale(langCookie)) {
        return langCookie;
    }

    const headersList = await headers();
    const acceptLanguage = headersList.get("accept-language");

    if (acceptLanguage) {
        const browserLocales = acceptLanguage
            .split(",")
            .map((lang) => lang.split(";")[0].trim().substring(0, 2).toLowerCase());

        for (const browserLocale of browserLocales) {
            if (isValidLocale(browserLocale)) {
                return browserLocale;
            }
        }
    }

    return defaultLocale;
});

export const getTranslations = cache(
    async (locale?: string): Promise<Translations> => {
        const currentLocale = locale || (await getLocale());
        const validLocale = isValidLocale(currentLocale)
            ? currentLocale
            : defaultLocale;

        if (translationsCache.has(validLocale)) {
            return translationsCache.get(validLocale)!;
        }

        try {
            const translations = await import(`./dictionaries/${validLocale}.json`);
            const data = translations.default || translations;
            translationsCache.set(validLocale, data);
            return data;
        } catch {
            if (validLocale !== defaultLocale) {
                return getTranslations(defaultLocale);
            }
            return {};
        }
    }
);

export const getT = cache(async (locale?: string) => {
    const translations = await getTranslations(locale);

    return (key: string): string => {
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
    };
});
