"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, LogIn, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { useI18n } from "@/lib/i18n";
import { env } from "@/lib/env";

export function Navbar() {
    const { locale, t } = useI18n();
    const blogEnabled = env.NEXT_PUBLIC_ENABLE_BLOG;

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm"
        >
            <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
                <div className="flex items-center gap-6">
                    <Link href={`/${locale}`} className="text-xl font-semibold tracking-tight">
                        nextjs-starter
                    </Link>
                    {blogEnabled && (
                        <Link
                            href={`/${locale}/blog`}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                        >
                            <FileText className="h-4 w-4" />
                            {t("blog.title")}
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <a
                            href="https://github.com/wleci/nextjs-fullstack-starter"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                    </Button>

                    <LanguageSwitcher />
                    <ThemeSwitcher />

                    <Button asChild size="sm">
                        <Link href={`/${locale}/auth/login`}>
                            <LogIn className="mr-2 h-4 w-4" />
                            {t("auth.login.submit")}
                        </Link>
                    </Button>
                </div>
            </nav>
        </motion.header>
    );
}
