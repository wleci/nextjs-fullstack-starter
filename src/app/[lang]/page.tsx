import { Navbar, Hero, Features, Footer } from "@/components/layout";
import { supportedLocales } from "@/lib/i18n";

export function generateStaticParams() {
    return supportedLocales.map((lang) => ({ lang }));
}

export default function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <Footer />
        </>
    );
}
