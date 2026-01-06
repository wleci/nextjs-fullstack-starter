import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

const BASE_URL = env.NEXT_PUBLIC_APP_URL;
const SUPPORTED_LANGS = env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(",").map((l) => l.trim());

/**
 * Generates sitemap for all pages and languages
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [""];

    const entries: MetadataRoute.Sitemap = [];

    for (const route of routes) {
        for (const lang of SUPPORTED_LANGS) {
            entries.push({
                url: `${BASE_URL}/${lang}${route}`,
                lastModified: new Date(),
                changeFrequency: "weekly",
                priority: route === "" ? 1 : 0.8,
                alternates: {
                    languages: Object.fromEntries(
                        SUPPORTED_LANGS.map((l) => [l, `${BASE_URL}/${l}${route}`])
                    ),
                },
            });
        }
    }

    return entries;
}
