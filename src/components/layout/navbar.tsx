"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, LogIn, FileText, Sparkles } from "lucide-react";
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
            className="fixed top-0 left-0 right-0 z-50"
        >
            {/* Backdrop blur container */}
            <div className="absolute inset-0 bg-background/60 backdrop-blur-xl border-b border-border/40" />
            
            {/* Gradient glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-50" />
            
            <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <div className="flex items-center gap-8">
                    <Link 
                        href={`/${locale}`} 
                        className="group flex items-center gap-2 text-xl font-bold tracking-tight transition-all hover:scale-105"
                    >
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {env.NEXT_PUBLIC_APP_NAME}
                        </span>
                    </Link>
                    
                    {/* Navigation Links */}
                    {blogEnabled && (
                        <div className="hidden md:flex items-center gap-1">
                            <Link
                                href={`/${locale}/blog`}
                                className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-muted/50"
                            >
                                <FileText className="h-4 w-4 transition-transform group-hover:scale-110" />
                                <span>{t("blog.title")}</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-2">
                    {/* GitHub */}
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className="rounded-lg hover:bg-muted/50 transition-all hover:scale-105"
                        asChild
                    >
                        <a
                            href="https://github.com/wleci/nextjs-fullstack-starter"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                    </Button>

                    {/* Language Switcher */}
                    <LanguageSwitcher />
                    
                    {/* Theme Switcher */}
                    <ThemeSwitcher />

                    {/* Divider */}
                    <div className="hidden sm:block h-6 w-px bg-border/60 mx-1" />

                    {/* Login Button */}
                    <Button 
                        asChild 
                        size="sm"
                        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105"
                    >
                        <Link href={`/${locale}/auth/login`}>
                            <span className="relative z-10 flex items-center gap-2">
                                <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                <span className="hidden sm:inline">{t("auth.login.submit")}</span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                    </Button>
                </div>
            </nav>
        </motion.header>
    );
}
