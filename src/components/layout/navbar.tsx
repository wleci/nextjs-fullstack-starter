"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./theme-switcher";

export function Navbar() {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm"
        >
            <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
                <Link href="/" className="text-xl font-semibold tracking-tight">
                    nextjs-starter
                </Link>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                    </Button>

                    <ThemeSwitcher />
                </div>
            </nav>
        </motion.header>
    );
}
