import { env } from "@/lib/env";

export const COOKIE_NAME = "lang";
export const COOKIE_MAX_AGE = 31536000;

export const defaultLocale = env.NEXT_PUBLIC_DEFAULT_LOCALE;
export const supportedLocales = env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(",");

export type Locale = (typeof supportedLocales)[number];

export function isValidLocale(locale: string): locale is Locale {
    return supportedLocales.includes(locale);
}
