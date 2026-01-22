import { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "@/lib/env";
import { getT } from "@/lib/i18n/server";
import { supportedLocales } from "@/lib/i18n/config";
import {
    isBlogEnabled,
    getBlogPostBySlug,
    getRelatedPosts,
    getCategories,
    getAllPublishedSlugs,
    getPostTranslations,
} from "@/lib/blog/queries";
import { BlogPostClient } from "./blog-post-client";

interface Props {
    params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
    if (!env.NEXT_PUBLIC_ENABLE_BLOG) {
        return [];
    }

    const slugs = await getAllPublishedSlugs();
    return slugs.map(({ slug, locale }) => ({
        lang: locale,
        slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang, slug } = await params;

    if (!env.NEXT_PUBLIC_ENABLE_BLOG) {
        return {};
    }

    const post = await getBlogPostBySlug(slug, lang);

    if (!post) {
        return {};
    }

    return {
        title: post.title,
        description: post.excerpt ?? undefined,
        openGraph: {
            title: post.title,
            description: post.excerpt ?? undefined,
            type: "article",
            publishedTime: post.publishedAt?.toISOString(),
            authors: post.authorName ? [post.authorName] : undefined,
            images: post.coverImage ? [post.coverImage] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt ?? undefined,
            images: post.coverImage ? [post.coverImage] : undefined,
        },
        alternates: {
            canonical: `${env.NEXT_PUBLIC_APP_URL}/${lang}/blog/${slug}`,
            languages: Object.fromEntries(
                supportedLocales.map((locale) => [
                    locale,
                    `${env.NEXT_PUBLIC_APP_URL}/${locale}/blog/${slug}`,
                ])
            ),
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    if (!env.NEXT_PUBLIC_ENABLE_BLOG) {
        notFound();
    }

    const { lang, slug } = await params;
    const t = await getT(lang);

    const blogEnabled = await isBlogEnabled();
    if (!blogEnabled) {
        notFound();
    }

    const post = await getBlogPostBySlug(slug, lang);
    if (!post) {
        notFound();
    }

    const [relatedPosts, categories, translations] = await Promise.all([
        getRelatedPosts(post.postId, lang, post.categories, 6),
        getCategories(lang),
        getPostTranslations(post.postId),
    ]);

    // Filter out current locale from translations
    const otherTranslations = translations.filter((tr) => tr.locale !== lang);

    const translationsText = {
        readTime: t("blog.readTime"),
        by: t("blog.by"),
        relatedPosts: t("blog.relatedPosts"),
        sharePost: t("blog.sharePost"),
        backToBlog: t("blog.backToBlog"),
        readMore: t("blog.readMore"),
        availableIn: t("blog.availableIn"),
    };

    return (
        <BlogPostClient
            locale={lang}
            post={post}
            relatedPosts={relatedPosts}
            categories={categories}
            translations={translationsText}
            otherTranslations={otherTranslations}
        />
    );
}
