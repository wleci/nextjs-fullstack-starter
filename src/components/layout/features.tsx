"use client";

import { motion } from "framer-motion";
import {
    Lock, Mail, LayoutDashboard, Globe, Palette, Database,
    Shield, Zap, Code, CheckCircle,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const FEATURES = [
    {
        icon: Lock,
        titleKey: "features.auth.title",
        descKey: "features.auth.desc",
        color: "text-blue-500",
    },
    {
        icon: Mail,
        titleKey: "features.email.title",
        descKey: "features.email.desc",
        color: "text-green-500",
    },
    {
        icon: LayoutDashboard,
        titleKey: "features.dashboard.title",
        descKey: "features.dashboard.desc",
        color: "text-purple-500",
    },
    {
        icon: Globe,
        titleKey: "features.i18n.title",
        descKey: "features.i18n.desc",
        color: "text-orange-500",
    },
    {
        icon: Palette,
        titleKey: "features.ui.title",
        descKey: "features.ui.desc",
        color: "text-pink-500",
    },
    {
        icon: Database,
        titleKey: "features.database.title",
        descKey: "features.database.desc",
        color: "text-cyan-500",
    },
    {
        icon: Shield,
        titleKey: "features.security.title",
        descKey: "features.security.desc",
        color: "text-red-500",
    },
    {
        icon: Zap,
        titleKey: "features.performance.title",
        descKey: "features.performance.desc",
        color: "text-yellow-500",
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export function Features() {
    const { t } = useTranslation();

    return (
        <section className="relative bg-background px-6 py-20">
            {/* Top gradient blend */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none" />
            
            <div className="mx-auto max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{t("features.badge")}</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        {t("features.title")}
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {t("features.subtitle")}
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {FEATURES.map((feature) => (
                        <motion.div
                            key={feature.titleKey}
                            variants={item}
                            className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-lg"
                        >
                            <div className={`mb-4 inline-flex rounded-lg bg-muted p-3 ${feature.color}`}>
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 font-semibold">{t(feature.titleKey)}</h3>
                            <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
                            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent to-muted/50 opacity-0 transition-opacity group-hover:opacity-100" />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border bg-background px-6 py-3">
                        <Code className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">{t("features.tech")}</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
