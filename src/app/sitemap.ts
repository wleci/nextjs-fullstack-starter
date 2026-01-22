import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

const BASE_URL = env.NEXT_PUBLIC_APP_URL;
const SUPPORTED_LANGS = env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(",").map((l) => l.trim());

/**
 * Generates dynamic sitemap for all pages and languages
 * Automatically includes blog posts when blog is enabled
 * Updates on every request with fresh data
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const entries: MetadataRoute.Sitemap = [];
    const now = new Date();

    // Static routes with priorities
    const staticRoutes = [
        { path: "", priority: 1.0, changeFrequency: "weekly" as const },
        { path: "/dashboard", priority: 0.8, changeFrequency: "daily" as const },
    ];

    // Add static routes for all languages
    for (const route of staticRoutes) {
        for (const lang of SUPPORTED_LANGS) {
            entries.push({
                url: `${BASE_URL}/${lang}${route.path}`,
                lastModified: now,
                changeFrequency: route.changeFrequency,
                priority: route.priority,
                alternates: {
                    languages: Object.fromEntries(
                        SUPPORTED_LANGS.map((l) => [l, `${BASE_URL}/${l}${route.path}`])
                    ),
                },
            });
        }
    }

    // Add blog routes if enabled
    if (env.NEXT_PUBLIC_ENABLE_BLOG) {
        try {
            const { getAllPublishedPosts, isBlogEnabled } = await import("@/lib/blog/queries");

            const blogEnabled = await isBlogEnabled();
            if (blogEnabled) {
                // Add blog index page
                for (const lang of SUPPORTED_LANGS) {
                    entries.push({
                        url: `${BASE_URL}/${lang}/blog`,
                        lastModified: now,
                        changeFrequency: "daily",
                        priority: 0.9,
                        alternates: {
                            languages: Object.fromEntries(
                                SUPPORTED_LANGS.map((l) => [l, `${BASE_URL}/${l}/blog`])
                            ),
                        },
                    });
                }

                // Get all published posts with metadata
                const posts = await getAllPublishedPosts();

                // Group posts by postId to handle translations
                const postGroups = new Map<string, typeof posts>();
                for (const post of posts) {
                    const existing = postGroups.get(post.postId) || [];
                    existing.push(post);
                    postGroups.set(post.postId, existing);
                }

                // Add individual blog posts with proper alternates
                for (const [postId, translations] of postGroups) {
                    // Find the most recent update across all translations
                    const lastModified = translations.reduce((latest, post) => {
                        const postDate = new Date(post.updatedAt);
                        return postDate > latest ? postDate : latest;
                    }, new Date(0));

                    for (const post of translations) {
                        // Build alternates map with actual slugs for each language
                        const alternates: Record<string, string> = {};
                        for (const translation of translations) {
                            alternates[translation.locale] = `${BASE_URL}/${translation.locale}/blog/${translation.slug}`;
                        }

                        entries.push({
                            url: `${BASE_URL}/${post.locale}/blog/${post.slug}`,
                            lastModified,
                            changeFrequency: "weekly",
                            priority: post.featured ? 0.8 : 0.7,
                            alternates: {
                                languages: alternates,
                            },
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Failed to generate blog sitemap:", error);
        }
    }

    return entries;
}

/**
 * Revalidate sitemap every hour
 */
export const revalidate = 3600;
