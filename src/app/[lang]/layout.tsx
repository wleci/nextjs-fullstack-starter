import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "@/lib/env";
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
    const translations = await getTranslations(lang);
    const hero = translations.hero as Record<string, string>;

    return {
        title: {
            default: "Next.js Starter",
            template: "%s | Next.js Starter",
        },
        description: hero?.description || "Production-ready starter template",
        openGraph: {
            type: "website",
            locale: lang,
            url: env.NEXT_PUBLIC_APP_URL,
            title: "Next.js Starter",
            description: hero?.description || "Production-ready starter template",
            siteName: "Next.js Starter",
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
