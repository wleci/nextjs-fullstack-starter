"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

export function Hero() {
    const { t } = useTranslation();

    return (
        <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 pt-16 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="mb-6 flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground"
                >
                    <Sparkles className="h-4 w-4" />
                    <span>{t("hero.badge")}</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
                >
                    {t("hero.title")}{" "}
                    <span className="bg-gradient-to-r from-zinc-600 to-zinc-900 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
                        {t("hero.titleHighlight")}
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-6 max-w-xl text-lg text-muted-foreground"
                >
                    {t("hero.description")}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-8 flex flex-col gap-4 sm:flex-row"
                >
                    <Button size="lg" className="gap-2">
                        {t("common.getStarted")}
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline">
                        {t("common.documentation")}
                    </Button>
                </motion.div>
            </motion.div>
        </section>
    );
}
