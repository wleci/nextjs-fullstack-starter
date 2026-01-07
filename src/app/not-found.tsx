"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COOKIE_NAME, defaultLocale, isValidLocale } from "@/lib/i18n";

const translations = {
    en: {
        lost: "Lost?",
        description: "The page you're looking for doesn't exist or has been moved.",
        goBack: "Go back",
        home: "Home",
    },
    pl: {
        lost: "Zgubiłeś się?",
        description: "Strona, której szukasz, nie istnieje lub została przeniesiona.",
        goBack: "Wróć",
        home: "Strona główna",
    },
};

export default function NotFound() {
    const [locale, setLocale] = useState(defaultLocale);

    useEffect(() => {
        const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
        const cookieLocale = match ? match[1] : null;
        if (cookieLocale && isValidLocale(cookieLocale)) {
            setLocale(cookieLocale);
        }
    }, []);

    const t = translations[locale as keyof typeof translations] || translations.en;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="relative"
                >
                    <span className="text-[10rem] font-bold leading-none text-muted-foreground/20 sm:text-[14rem]">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold sm:text-5xl">{t.lost}</span>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="mt-4 max-w-md text-lg text-muted-foreground"
                >
                    {t.description}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="mt-8 flex gap-4"
                >
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t.goBack}
                    </Button>
                    <Button asChild>
                        <Link href={`/${locale}`}>
                            <Home className="mr-2 h-4 w-4" />
                            {t.home}
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}
