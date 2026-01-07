import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "lang";
const COOKIE_MAX_AGE = 31536000;
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en";
const SUPPORTED_LOCALES = (
    process.env.NEXT_PUBLIC_SUPPORTED_LOCALES || "en,pl"
).split(",");

function isValidLocale(locale: string): boolean {
    return SUPPORTED_LOCALES.includes(locale);
}

function getLocaleFromPath(pathname: string): string | null {
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];
    return firstSegment && isValidLocale(firstSegment) ? firstSegment : null;
}

function getLocaleFromHeader(request: NextRequest): string {
    const acceptLanguage = request.headers.get("accept-language");
    if (!acceptLanguage) return DEFAULT_LOCALE;

    const browserLocales = acceptLanguage
        .split(",")
        .map((lang) => lang.split(";")[0].trim().substring(0, 2).toLowerCase());

    for (const locale of browserLocales) {
        if (isValidLocale(locale)) {
            return locale;
        }
    }

    return DEFAULT_LOCALE;
}

export function handleI18n(request: NextRequest): NextResponse | null {
    const { pathname } = request.nextUrl;
    const pathLocale = getLocaleFromPath(pathname);
    const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;

    // URL has locale - update cookie to match
    if (pathLocale) {
        if (cookieLocale !== pathLocale) {
            const response = NextResponse.next();
            response.cookies.set(COOKIE_NAME, pathLocale, {
                path: "/",
                maxAge: COOKIE_MAX_AGE,
                sameSite: "lax",
            });
            return response;
        }
        return null;
    }

    // No locale in URL - redirect to locale path
    const locale =
        cookieLocale && isValidLocale(cookieLocale)
            ? cookieLocale
            : getLocaleFromHeader(request);

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;

    const response = NextResponse.redirect(url);
    response.cookies.set(COOKIE_NAME, locale, {
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
    });

    return response;
}
