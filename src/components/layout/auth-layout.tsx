"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { useLocale, useTranslation } from "@/lib/i18n";
import { env } from "@/lib/env";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    const { locale } = useLocale();
    const { t } = useTranslation();

    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            {/* Left - Form */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between p-6">
                    <Link
                        href={`/${locale}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t("common.home")}
                    </Link>
                    <div className="flex items-center gap-2 lg:hidden">
                        <LanguageSwitcher />
                        <ThemeSwitcher />
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-center px-6 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full max-w-sm"
                    >
                        {children}
                    </motion.div>
                </div>
            </div>

            {/* Right - Branding */}
            <div className="relative hidden bg-muted lg:block">
                <div className="absolute right-6 top-6 flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                </div>
                <div className="flex h-full flex-col items-center justify-center px-12">
                    <Link href={`/${locale}`} className="mb-8 text-3xl font-bold">
                        {env.NEXT_PUBLIC_APP_NAME}
                    </Link>
                    <p className="max-w-md text-center text-muted-foreground">
                        Production-ready Next.js panel with authentication, i18n, and modern tooling.
                    </p>
                </div>
            </div>
        </div>
    );
}
