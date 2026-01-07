import { getT } from "@/lib/i18n/server";
import { supportedLocales } from "@/lib/i18n";
import { Navbar, Footer } from "@/components/layout";
import { Cookie } from "lucide-react";

export function generateStaticParams() {
    return supportedLocales.map((lang) => ({ lang }));
}

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function CookiesPage({ params }: Props) {
    const { lang } = await params;
    const t = await getT(lang);

    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-3xl px-6 py-20">
                <div className="mb-12 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Cookie className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        {t("legal.cookies.title")}
                    </h1>
                </div>

                <div className="space-y-8 text-muted-foreground">
                    <p className="text-lg">{t("legal.cookies.intro")}</p>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">
                            {t("legal.cookies.what.title")}
                        </h2>
                        <p>{t("legal.cookies.what.content")}</p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">
                            {t("legal.cookies.types.title")}
                        </h2>
                        <p>{t("legal.cookies.types.content")}</p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">
                            {t("legal.cookies.manage.title")}
                        </h2>
                        <p>{t("legal.cookies.manage.content")}</p>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
