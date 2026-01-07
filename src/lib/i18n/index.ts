// Config
export {
    COOKIE_NAME,
    COOKIE_MAX_AGE,
    defaultLocale,
    supportedLocales,
    isValidLocale,
    type Locale,
} from "./config";

// Client
export { I18nProvider, useI18n, useLocale, useTranslation } from "./client";

// Lang Script
export { LangScript } from "./lang-script";

// Server - import directly:
// import { getLocale, getTranslations, getT } from "@/lib/i18n/server";
