"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const COOKIE_CONSENT_KEY = "cookie-consent";

export function CookieBanner() {
    const [show, setShow] = useState(false);
    const { t, locale } = useI18n();

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            const timer = setTimeout(() => setShow(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const accept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
        setShow(false);
    };

    const decline = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
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
                    className="fixed bottom-4 left-4 right-4 z-50 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md"
                >
                    <div className="relative overflow-hidden rounded-2xl border bg-background/95 p-6 shadow-2xl backdrop-blur-md">
                        <button
                            onClick={decline}
                            className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
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

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={decline}
                                className="flex-1"
                            >
                                {t("cookies.decline")}
                            </Button>
                            <Button size="sm" onClick={accept} className="flex-1">
                                {t("cookies.accept")}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
