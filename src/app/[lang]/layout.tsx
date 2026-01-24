import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "@/lib/env";
import { I18nProvider, isValidLocale, supportedLocales } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n/server";
import { CookieBanner } from "@/components/layout";

export async function generateStaticParams() {
    return supportedLocales.map((lang) => ({ lang }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const { lang } = await params;
    const translations = await getTranslations(lang);
    const hero = translations.hero as Record<string, string>;
    const canonicalUrl = `${env.NEXT_PUBLIC_APP_URL}/${lang}`;

    return {
        title: {
            default: env.NEXT_PUBLIC_APP_NAME,
            template: `%s | ${env.NEXT_PUBLIC_APP_NAME}`,
        },
        description: hero?.description || "Production-ready panel template",
        alternates: {
            canonical: canonicalUrl,
            languages: Object.fromEntries(
                supportedLocales.map((locale) => [locale, `${env.NEXT_PUBLIC_APP_URL}/${locale}`])
            ),
        },
        openGraph: {
            type: "website",
            locale: lang,
            url: canonicalUrl,
            title: env.NEXT_PUBLIC_APP_NAME,
            description: hero?.description || "Production-ready panel template",
            siteName: env.NEXT_PUBLIC_APP_NAME,
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
            <CookieBanner />
        </I18nProvider>
    );
}
