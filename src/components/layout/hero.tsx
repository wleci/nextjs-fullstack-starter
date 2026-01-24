"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";
import { Meteors } from "@/components/ui/meteors";
import { GridBackground } from "@/components/ui/grid-background";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { useTranslation } from "@/lib/i18n";

export function Hero() {
    const { t } = useTranslation();

    const features = [
        { icon: Zap, label: "Fast" },
        { icon: Shield, label: "Secure" },
        { icon: Rocket, label: "Modern" },
    ];

    return (
        <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-6 pt-16 pb-32">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <AuroraBackground />
                <GridBackground />
                <FloatingParticles />
                <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
                <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="purple" />
                <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
                <Meteors number={40} />
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/60 via-70% to-background" />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.15),transparent_50%)]" />
            
            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col items-center text-center"
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="group mb-6 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-xl px-4 py-1.5 text-sm text-foreground shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300"
                >
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                    <span className="font-medium">{t("hero.badge")}</span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl lg:text-8xl"
                >
                    {t("hero.title")}{" "}
                    <span className="relative inline-block">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 animate-[glow_3s_ease-in-out_infinite]">
                            {t("hero.titleHighlight")}
                        </span>
                        <motion.div
                            className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 blur-2xl"
                            animate={{
                                opacity: [0.2, 0.4, 0.2],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed"
                >
                    {t("hero.description")}
                </motion.p>

                {/* Feature Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="mt-6 flex flex-wrap items-center justify-center gap-3"
                >
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + idx * 0.1, duration: 0.3 }}
                            className="flex items-center gap-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300"
                        >
                            <feature.icon className="h-4 w-4 text-primary" />
                            <span>{feature.label}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-10"
                >
                    <Button 
                        size="lg" 
                        className="group relative gap-2 overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {t("common.getStarted")}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                </motion.div>

                {/* Stats or Social Proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="mt-12 flex items-center gap-8 text-sm text-muted-foreground"
                >
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span>Production Ready</span>
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div>TypeScript First</div>
                    <div className="h-4 w-px bg-border" />
                    <div>Open Source</div>
                </motion.div>
            </motion.div>
        </section>
    );
}
