import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { env } from "@/lib/env";
import { getT, getLocale } from "@/lib/i18n/server";
import { supportedLocales } from "@/lib/i18n/config";
import {
    isBlogEnabled,
    getBlogSettings,
    getFeaturedPost,
    getBlogPosts,
    getCategories,
} from "@/lib/blog/queries";
import { BlogPageClient } from "./blog-page-client";

interface Props {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ page?: string; category?: string; search?: string; sort?: string }>;
}

export async function generateStaticParams() {
    if (!env.NEXT_PUBLIC_ENABLE_BLOG) {
        return [];
    }
    return supportedLocales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    const t = await getT(lang);

    return {
        title: t("blog.title"),
        description: t("blog.description"),
        alternates: {
            canonical: `${env.NEXT_PUBLIC_APP_URL}/${lang}/blog`,
            languages: Object.fromEntries(
                supportedLocales.map((locale) => [locale, `${env.NEXT_PUBLIC_APP_URL}/${locale}/blog`])
            ),
        },
    };
}

export default async function BlogPage({ params, searchParams }: Props) {
    if (!env.NEXT_PUBLIC_ENABLE_BLOG) {
        notFound();
    }

    const { lang } = await params;
    const search = await searchParams;
    const t = await getT(lang);

    const [blogEnabled, settings, categories] = await Promise.all([
        isBlogEnabled(),
        getBlogSettings(),
        getCategories(lang),
    ]);

    if (!blogEnabled) {
        notFound();
    }

    const page = parseInt(search.page ?? "1", 10);
    const category = search.category;
    const searchQuery = search.search;
    const sort = search.sort ?? "newest";

    // Show featured post only on first page without filters
    const showFeaturedHero = (settings.showFeatured ?? true) && page === 1 && !category && !searchQuery;

    const [featuredPost, postsData] = await Promise.all([
        showFeaturedHero ? getFeaturedPost(lang) : Promise.resolve(null),
        getBlogPosts({
            locale: lang,
            page,
            limit: settings.postsPerPage ?? 12,
            category,
            search: searchQuery,
            sort: sort as "newest" | "oldest",
            excludeFeatured: false,
        }),
    ]);

    const translations = {
        title: t("blog.title"),
        description: t("blog.description"),
        search: t("blog.search"),
        allCategories: t("blog.allCategories"),
        featured: t("blog.featured"),
        latestPosts: t("blog.latestPosts"),
        allPosts: t("blog.allPosts"),
        readMore: t("blog.readMore"),
        readTime: t("blog.readTime"),
        by: t("blog.by"),
        noPosts: t("blog.noPosts"),
        noPostsDescription: t("blog.noPostsDescription"),
        loadMore: t("blog.loadMore"),
        nextPage: t("blog.nextPage"),
        prevPage: t("blog.prevPage"),
        page: t("blog.page"),
        of: t("blog.of"),
        sortBy: t("blog.sortBy"),
        newest: t("blog.newest"),
        oldest: t("blog.oldest"),
        clearFilters: t("blog.clearFilters"),
    };

    return (
        <BlogPageClient
            locale={lang}
            featuredPost={featuredPost}
            posts={postsData.posts}
            categories={categories}
            pagination={{
                page: postsData.page,
                totalPages: postsData.totalPages,
                hasMore: postsData.hasMore,
                total: postsData.total,
            }}
            currentCategory={category}
            currentSearch={searchQuery}
            currentSort={sort}
            translations={translations}
        />
    );
}
