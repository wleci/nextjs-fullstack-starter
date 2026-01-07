# i18n Implementation Guide

This guide documents the co8n (internationalization) implementation from commit `260e76e09f6a664531f7493cd438f72e59dba7de`. Follow these steps to implement the same i18n system in a new Next.js project.

## Overview

This implementation provides:

- Multi-language support (English and Polish by default)
- Locale-based routing (`/en/...`, `/pl/...`)
- Server and client-side translation utilities
- Automatic locale detection from cookies and browser headers
- Language switcher component
- Middleware for locale handling and redirection

---

## Step 1: Environment Configuration

### File: `src/lib/env/env.ts`

Add locale configuration to your environment schema:

```typescript
// Add to client config:
client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default("en"),
    NEXT_PUBLIC_SUPPORTED_LOCALES: z.string().default("en,pl"),
},

// Add to runtimeEnv:
runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
    NEXT_PUBLIC_SUPPORTED_LOCALES: process.env.NEXT_PUBLIC_SUPPORTED_LOCALES,
},
```

### File: `.env` (add these variables)

```env
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,pl
```

---

## Step 2: Translation Files

Create translation JSON files in the `locales/` directory at the project root.

### File: `locales/en.json`

```json
{
  "hello": "Hello",
  "welcome": "Welcome to our app",
  "home": "Home",
  "about": "About",
  "contact": "Contact",
  "language": "Language",
  "theme": "Theme"
}
```

### File: `locales/pl.json`

```json
{
  "hello": "Cześć",
  "welcome": "Witamy w naszej aplikacji",
  "home": "Strona główna",
  "about": "O nas",
  "contact": "Kontakt",
  "language": "Język",
  "theme": "Motyw"
}
```

---

## Step 3: i18n Library

Create the i18n library in `src/lib/i18n/` directory.

### File: `src/lib/i18n/config.ts`

```typescript
import { env } from "@/lib/env/env";

export const COOKIE_NAME = "lang";
export const COOKIE_MAX_AGE = 31536000;

export const defaultLocale = env.NEXT_PUBLIC_DEFAULT_LOCALE;
export const supportedLocales = env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(",");

export type Locale = (typeof supportedLocales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale);
}
```

### File: `src/lib/i18n/server.ts`

```typescript
import "server-only";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { COOKIE_NAME, defaultLocale, isValidLocale } from "./config";

type Translations = Record<string, string>;

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
      const translations = await import(`../../../locales/${validLocale}.json`);
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
  return (key: string): string => translations[key] || key;
});
```

### File: `src/lib/i18n/client.tsx`

```typescript
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

type Translations = Record<string, string>;

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
            `../../../locales/${validLocale}.json`
          );
          setTranslations(newTranslations.default || newTranslations);
          setLocaleState(validLocale);

          // Navigate to new locale
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
    (key: string): string => translations[key] || key,
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
```

### File: `src/lib/i18n/lang-script.tsx`

```typescript
export function LangScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var lang = document.cookie.match('(^|;)\\\\s*lang\\\\s*=\\\\s*([^;]+)');
            if (lang) {
              document.documentElement.lang = lang.pop();
            }
          })();
        `,
      }}
    />
  );
}
```

### File: `src/lib/i18n/index.ts`

```typescript
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
```

---

## Step 4: Middleware

Create middleware to handle locale detection and routing.

### File: `src/middleware/i18n.ts`

```typescript
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

  // URL has locale (e.g., /en/about) - update cookie to match
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
```

### File: `src/middleware/index.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { handleI18n } from "./i18n";

export function runMiddleware(request: NextRequest): NextResponse {
  const i18nResponse = handleI18n(request);
  if (i18nResponse) return i18nResponse;

  return NextResponse.next();
}
```

### File: `src/proxy.ts` (Next.js middleware entry point)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { runMiddleware } from "./middleware";

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  return runMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
```

**IMPORTANT:** Rename `src/proxy.ts` to `src/middleware.ts` for Next.js to recognize it.

---

## Step 5: App Structure Changes

### File: `src/app/layout.tsx` (Root Layout - UPDATE)

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { env } from "@/lib/env/env";
import { ThemeProvider, ThemeScript } from "@/lib/theme";
import { defaultLocale, LangScript } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Your App Name",
    template: "%s | Your App Name",
  },
  description: "Your app description for SEO",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <head>
        <LangScript />
        <ThemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### File: `src/app/[lang]/layout.tsx` (NEW - Locale Layout)

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "@/lib/env/env";
import { I18nProvider, isValidLocale, supportedLocales } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n/server";

export async function generateStaticParams() {
  return supportedLocales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations(lang);

  return {
    title: {
      default: "Your App Name",
      template: "%s | Your App Name",
    },
    description: t.welcome || "Your app description",
    openGraph: {
      type: "website",
      locale: lang,
      url: env.NEXT_PUBLIC_APP_URL,
      title: "Your App Name",
      description: t.welcome || "Your app description",
      siteName: "Your App Name",
    },
  };
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const translations = await getTranslations(lang);

  return (
    <I18nProvider locale={lang} translations={translations}>
      {children}
    </I18nProvider>
  );
}
```

### File: `src/app/[lang]/page.tsx` (NEW - Locale Home Page)

```typescript
import { getT } from "@/lib/i18n/server";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const t = await getT(lang);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">{t("hello")}</h1>
      <p>{t("welcome")}</p>
      <div className="flex gap-4">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </div>
  );
}
```

### DELETE: `src/app/page.tsx`

Remove the old root page file as all pages now live under `[lang]` directory.

---

## Step 6: Language Switcher Component

### File: `src/components/language-switcher.tsx` (NEW)

```typescript
"use client";

import { useLocale, supportedLocales } from "@/lib/i18n";
import { useEffect, useState } from "react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-2">
        {supportedLocales.map((lang) => (
          <button key={lang} className="px-4 py-2 rounded-md border uppercase">
            {lang}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {supportedLocales.map((lang) => (
        <button
          key={lang}
          onClick={() => setLocale(lang)}
          className={`px-4 py-2 rounded-md border uppercase ${
            locale === lang ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
```

---

## Step 7: Migration Checklist

- [ ] Add environment variables to `.env`
- [ ] Update `src/lib/env/env.ts` with locale config
- [ ] Create `locales/` directory with `en.json` and `pl.json`
- [ ] Create `src/lib/i18n/` directory with all 5 files
- [ ] Create `src/middleware/` directory with `i18n.ts` and `index.ts`
- [ ] Create/rename `src/middleware.ts` (or `src/proxy.ts`)
- [ ] Update `src/app/layout.tsx` (root layout)
- [ ] Create `src/app/[lang]/layout.tsx` (locale layout)
- [ ] Create `src/app/[lang]/page.tsx` (locale home page)
- [ ] Delete `src/app/page.tsx` (old root page)
- [ ] Create `src/components/language-switcher.tsx`
- [ ] Move all existing pages to `src/app/[lang]/` directory

---

## Usage Examples

### Server Components

```typescript
import { getT } from "@/lib/i18n/server";

export default async function MyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getT(lang);

  return <h1>{t("hello")}</h1>;
}
```

### Client Components

```typescript
"use client";

import { useTranslation } from "@/lib/i18n";

export function MyComponent() {
  const { t } = useTranslation();

  return <p>{t("welcome")}</p>;
}
```

### Change Language

```typescript
"use client";

import { useLocale } from "@/lib/i18n";

export function MyButton() {
  const { setLocale } = useLocale();

  return <button onClick={() => setLocale("pl")}>Polski</button>;
}
```

---

## Key Features

1. **Automatic Locale Detection**: Detects from cookie → browser headers → default
2. **SEO-Friendly URLs**: `/en/about`, `/pl/about`
3. **Type-Safe**: TypeScript support with proper types
4. **Performance**: Server-side caching of translations
5. **Flexible**: Easy to add new languages by adding JSON files
6. **Client & Server**: Works in both server and client components

---

## Adding New Languages

1. Create `locales/[lang].json` with translations
2. Update `.env`: `NEXT_PUBLIC_SUPPORTED_LOCALES=en,pl,de`
3. That's it! The system automatically supports the new language.

---

## Notes

- All routes must be under `[lang]` directory
- Middleware automatically redirects `/` to `/en` (or detected locale)
- Translations are cached for performance
- Cookie expires in 1 year (31536000 seconds)
