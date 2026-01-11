"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Home, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher, LanguageSwitcher } from "@/components/layout";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/auth/client";

export function BlogNavbar() {
    const { locale, t } = useI18n();
    const { data: session } = useSession();

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md"
        >
            <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-8">
                    <Link
                        href={`/${locale}`}
                        className="flex items-center gap-2 text-xl font-semibold tracking-tight hover:text-primary transition-colors"
                    >
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="hidden sm:inline">Blog</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        <Link href={`/${locale}`}>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                <Home className="h-4 w-4 mr-2" />
                                {t("common.home")}
                            </Button>
                        </Link>
                        <Link href={`/${locale}/blog`}>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                <BookOpen className="h-4 w-4 mr-2" />
                                {t("blog.title")}
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher />

                    {session ? (
                        <Link href={`/${locale}/dashboard`}>
                            <Button size="sm" variant="outline" className="gap-2">
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">{session.user.name?.split(" ")[0]}</span>
                            </Button>
                        </Link>
                    ) : (
                        <Link href={`/${locale}/auth/login`}>
                            <Button size="sm" className="gap-2">
                                <LogIn className="h-4 w-4" />
                                <span className="hidden sm:inline">{t("auth.login.submit")}</span>
                            </Button>
                        </Link>
                    )}
                </div>
            </nav>
        </motion.header>
    );
}
