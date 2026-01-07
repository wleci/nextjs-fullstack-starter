"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { useLocale } from "@/lib/i18n";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    const { locale } = useLocale();

    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            {/* Left - Form */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between p-6 lg:hidden">
                    <Link href={`/${locale}`} className="text-xl font-bold">
                        Starter
                    </Link>
                    <div className="flex items-center gap-2">
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
                        Starter
                    </Link>
                    <p className="max-w-md text-center text-muted-foreground">
                        Production-ready Next.js starter with authentication, i18n, and modern tooling.
                    </p>
                </div>
            </div>
        </div>
    );
}
