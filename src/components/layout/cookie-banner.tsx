"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { getCookieConsent, setCookieConsent } from "@/lib/cookies";

export function CookieBanner() {
    const [show, setShow] = useState(false);
    const { t, locale } = useI18n();

    useEffect(() => {
        const consent = getCookieConsent();
        if (!consent) {
            const timer = setTimeout(() => setShow(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptAll = () => {
        setCookieConsent("all");
        setShow(false);
    };

    const acceptRequired = () => {
        setCookieConsent("required");
        setShow(false);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed bottom-4 left-4 right-4 z-50 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md"
                >
                    <div className="relative overflow-hidden rounded-2xl border bg-background/95 p-6 shadow-2xl backdrop-blur-md">
                        <button
                            onClick={acceptRequired}
                            className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label={t("cookies.close")}
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <Cookie className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold">{t("cookies.title")}</h3>
                        </div>

                        <p className="mb-4 text-sm text-muted-foreground">
                            {t("cookies.banner")}{" "}
                            <Link
                                href={`/${locale}/cookies`}
                                className="underline underline-offset-2 hover:text-foreground"
                            >
                                {t("cookies.learnMore")}
                            </Link>
                        </p>

                        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={acceptRequired}
                                className="flex-1"
                            >
                                {t("cookies.requiredOnly")}
                            </Button>
                            <Button size="sm" onClick={acceptAll} className="flex-1">
                                {t("cookies.acceptAll")}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
