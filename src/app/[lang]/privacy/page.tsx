import { getT } from "@/lib/i18n/server";
import { supportedLocales } from "@/lib/i18n";
import { Navbar, Footer } from "@/components/layout";
import { Shield } from "lucide-react";

export function generateStaticParams() {
    return supportedLocales.map((lang) => ({ lang }));
}

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function PrivacyPage({ params }: Props) {
    const { lang } = await params;
    const t = await getT(lang);

    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-3xl px-6 py-20">
                <div className="mb-12 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        {t("legal.privacy.title")}
                    </h1>
                </div>

                <div className="space-y-8 text-muted-foreground">
                    <p className="text-lg">{t("legal.privacy.intro")}</p>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">
                            {t("legal.privacy.dataCollection.title")}
                        </h2>
                        <p>{t("legal.privacy.dataCollection.content")}</p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">
                            {t("legal.privacy.cookies.title")}
                        </h2>
                        <p>{t("legal.privacy.cookies.content")}</p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">
                            {t("legal.privacy.rights.title")}
                        </h2>
                        <p>{t("legal.privacy.rights.content")}</p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">
                            {t("legal.privacy.contact.title")}
                        </h2>
                        <p>{t("legal.privacy.contact.content")}</p>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
