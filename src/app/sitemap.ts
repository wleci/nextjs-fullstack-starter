import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

const BASE_URL = env.NEXT_PUBLIC_APP_URL;
const SUPPORTED_LANGS = env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(",").map((l) => l.trim());

/**
 * Generates sitemap for all pages and languages
 * Dynamically includes blog posts when blog is enabled
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes = [""];
    const entries: MetadataRoute.Sitemap = [];

    // Add static routes
    for (const route of staticRoutes) {
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

    // Add blog routes if enabled
    if (env.NEXT_PUBLIC_ENABLE_BLOG) {
        const { getAllPublishedSlugs, isBlogEnabled } = await import("@/lib/blog/queries");

        const blogEnabled = await isBlogEnabled();
        if (blogEnabled) {
            // Add blog index page
            for (const lang of SUPPORTED_LANGS) {
                entries.push({
                    url: `${BASE_URL}/${lang}/blog`,
                    lastModified: new Date(),
                    changeFrequency: "daily",
                    priority: 0.9,
                    alternates: {
                        languages: Object.fromEntries(
                            SUPPORTED_LANGS.map((l) => [l, `${BASE_URL}/${l}/blog`])
                        ),
                    },
                });
            }

            // Add individual blog posts
            const slugs = await getAllPublishedSlugs();

            // Group slugs by postId to create proper alternates
            const postsBySlug = new Map<string, { locale: string; slug: string }[]>();
            for (const { slug, locale } of slugs) {
                const existing = postsBySlug.get(slug) || [];
                existing.push({ locale, slug });
                postsBySlug.set(slug, existing);
            }

            for (const { slug, locale } of slugs) {
                entries.push({
                    url: `${BASE_URL}/${locale}/blog/${slug}`,
                    lastModified: new Date(),
                    changeFrequency: "weekly",
                    priority: 0.7,
                    alternates: {
                        languages: Object.fromEntries(
                            SUPPORTED_LANGS.map((l) => [l, `${BASE_URL}/${l}/blog/${slug}`])
                        ),
                    },
                });
            }
        }
    }

    return entries;
}
