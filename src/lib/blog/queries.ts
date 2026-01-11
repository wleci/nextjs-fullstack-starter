import { db } from "@/lib/database";
import { blogPost, blogCategory, blogSettings } from "./schema";
import { eq, and, desc, asc, like, inArray, sql } from "drizzle-orm";
import type { ParsedBlogPost, BlogListResponse, LocalizedCategory, ContentBlock } from "./types";

/**
 * Parse blog post content from JSON string
 */
function parseContent(content: string): ContentBlock[] {
    try {
        return JSON.parse(content);
    } catch {
        return [];
    }
}

/**
 * Parse categories from comma-separated string
 */
function parseCategories(categories: string | null): string[] {
    if (!categories) return [];
    return categories.split(",").filter(Boolean);
}

/**
 * Convert raw blog post to parsed format
 */
function parseBlogPost(post: typeof blogPost.$inferSelect): ParsedBlogPost {
    return {
        ...post,
        content: parseContent(post.content),
        categories: parseCategories(post.categories),
    };
}

/**
 * Get blog settings
 */
export async function getBlogSettings() {
    const settings = await db.select().from(blogSettings).where(eq(blogSettings.id, "default")).get();

    if (!settings) {
        return {
            id: "default",
            enabled: true,
            postsPerPage: 12,
            showFeatured: true,
            updatedAt: new Date(),
        };
    }

    return settings;
}

/**
 * Check if blog is enabled
 */
export async function isBlogEnabled(): Promise<boolean> {
    const settings = await getBlogSettings();
    return settings.enabled ?? true;
}

/**
 * Get all categories with localized names
 * Combines categories from table with categories extracted from posts
 */
export async function getCategories(locale: string): Promise<LocalizedCategory[]> {
    // Get categories from table
    const tableCategories = await db.select().from(blogCategory).all();

    // Get all unique categories from published posts
    const posts = await db
        .select({ categories: blogPost.categories })
        .from(blogPost)
        .where(
            and(
                eq(blogPost.locale, locale),
                eq(blogPost.published, true)
            )
        )
        .all();

    // Extract unique category slugs from posts
    const postCategorySlugs = new Set<string>();
    posts.forEach((post) => {
        if (post.categories) {
            post.categories.split(",").filter(Boolean).forEach((cat) => {
                postCategorySlugs.add(cat.trim());
            });
        }
    });

    // Map table categories
    const result: LocalizedCategory[] = tableCategories.map((cat) => ({
        ...cat,
        name: locale === "pl" ? cat.namePl : cat.nameEn,
    }));

    // Add categories from posts that aren't in the table
    const tableSlugs = new Set(tableCategories.map((c) => c.slug));
    const defaultColors = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#14b8a6"];
    let colorIndex = 0;

    postCategorySlugs.forEach((slug) => {
        if (!tableSlugs.has(slug)) {
            result.push({
                id: slug,
                slug,
                nameEn: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
                namePl: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
                name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
                color: defaultColors[colorIndex % defaultColors.length],
                createdAt: new Date(),
            });
            colorIndex++;
        }
    });

    return result;
}

/**
 * Get featured post for locale
 */
export async function getFeaturedPost(locale: string): Promise<ParsedBlogPost | null> {
    const post = await db
        .select()
        .from(blogPost)
        .where(
            and(
                eq(blogPost.locale, locale),
                eq(blogPost.published, true),
                eq(blogPost.featured, true)
            )
        )
        .orderBy(desc(blogPost.publishedAt))
        .get();

    return post ? parseBlogPost(post) : null;
}

/**
 * Get paginated blog posts
 */
export async function getBlogPosts(options: {
    locale: string;
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: "newest" | "oldest";
    excludeFeatured?: boolean;
}): Promise<BlogListResponse> {
    const { locale, page = 1, limit = 12, category, search, sort = "newest", excludeFeatured = false } = options;
    const offset = (page - 1) * limit;

    const conditions = [
        eq(blogPost.locale, locale),
        eq(blogPost.published, true),
    ];

    if (excludeFeatured) {
        conditions.push(eq(blogPost.featured, false));
    }

    if (search) {
        conditions.push(like(blogPost.title, `%${search}%`));
    }

    if (category) {
        conditions.push(like(blogPost.categories, `%${category}%`));
    }

    const orderBy = sort === "oldest"
        ? asc(blogPost.publishedAt)
        : desc(blogPost.publishedAt);

    const [posts, countResult] = await Promise.all([
        db
            .select()
            .from(blogPost)
            .where(and(...conditions))
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset)
            .all(),
        db
            .select({ count: sql<number>`count(*)` })
            .from(blogPost)
            .where(and(...conditions))
            .get(),
    ]);

    const total = countResult?.count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
        posts: posts.map(parseBlogPost),
        total,
        page,
        totalPages,
        hasMore: page < totalPages,
    };
}

/**
 * Get single blog post by slug
 * First tries exact match (slug + locale), then finds post by slug in any language
 * and returns the version in requested locale
 */
export async function getBlogPostBySlug(slug: string, locale: string): Promise<ParsedBlogPost | null> {
    // First try exact match
    const exactMatch = await db
        .select()
        .from(blogPost)
        .where(
            and(
                eq(blogPost.slug, slug),
                eq(blogPost.locale, locale),
                eq(blogPost.published, true)
            )
        )
        .get();

    if (exactMatch) {
        return parseBlogPost(exactMatch);
    }

    // Find any post with this slug to get postId
    const anyPost = await db
        .select({ postId: blogPost.postId })
        .from(blogPost)
        .where(
            and(
                eq(blogPost.slug, slug),
                eq(blogPost.published, true)
            )
        )
        .get();

    if (!anyPost) {
        return null;
    }

    // Get the version in requested locale
    const localizedPost = await db
        .select()
        .from(blogPost)
        .where(
            and(
                eq(blogPost.postId, anyPost.postId),
                eq(blogPost.locale, locale),
                eq(blogPost.published, true)
            )
        )
        .get();

    return localizedPost ? parseBlogPost(localizedPost) : null;
}

/**
 * Get blog post by ID (for admin)
 */
export async function getBlogPostById(id: string): Promise<ParsedBlogPost | null> {
    const post = await db.select().from(blogPost).where(eq(blogPost.id, id)).get();
    return post ? parseBlogPost(post) : null;
}

/**
 * Get all posts for admin (all locales, including unpublished)
 */
export async function getAllBlogPosts(options: {
    page?: number;
    limit?: number;
    search?: string;
}): Promise<{ posts: ParsedBlogPost[]; total: number }> {
    const { page = 1, limit = 20, search } = options;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (search) {
        conditions.push(like(blogPost.title, `%${search}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [posts, countResult] = await Promise.all([
        db
            .select()
            .from(blogPost)
            .where(whereClause)
            .orderBy(desc(blogPost.createdAt))
            .limit(limit)
            .offset(offset)
            .all(),
        db
            .select({ count: sql<number>`count(*)` })
            .from(blogPost)
            .where(whereClause)
            .get(),
    ]);

    return {
        posts: posts.map(parseBlogPost),
        total: countResult?.count ?? 0,
    };
}

/**
 * Get related posts (same category, different post)
 * Falls back to latest posts if no category matches
 */
export async function getRelatedPosts(
    postId: string,
    locale: string,
    categories: string[],
    limit = 3
): Promise<ParsedBlogPost[]> {
    // Get other posts in the same locale
    const posts = await db
        .select()
        .from(blogPost)
        .where(
            and(
                eq(blogPost.locale, locale),
                eq(blogPost.published, true),
                sql`${blogPost.postId} != ${postId}`
            )
        )
        .orderBy(desc(blogPost.publishedAt))
        .limit(limit * 3)
        .all();

    if (posts.length === 0) {
        return [];
    }

    // If we have categories, prioritize posts with matching categories
    if (categories.length > 0) {
        const withMatchingCategories = posts.filter((post) => {
            const postCategories = parseCategories(post.categories);
            return postCategories.some((cat) => categories.includes(cat));
        });

        if (withMatchingCategories.length >= limit) {
            return withMatchingCategories.slice(0, limit).map(parseBlogPost);
        }

        // Fill remaining slots with other posts
        const otherPosts = posts.filter(
            (post) => !withMatchingCategories.includes(post)
        );
        const combined = [...withMatchingCategories, ...otherPosts].slice(0, limit);
        return combined.map(parseBlogPost);
    }

    // No categories - just return latest posts
    return posts.slice(0, limit).map(parseBlogPost);
}

/**
 * Get all published slugs for sitemap/static generation
 */
export async function getAllPublishedSlugs(): Promise<{ slug: string; locale: string }[]> {
    const posts = await db
        .select({ slug: blogPost.slug, locale: blogPost.locale })
        .from(blogPost)
        .where(eq(blogPost.published, true))
        .all();

    return posts;
}

/**
 * Get all translations of a post by postId
 * Returns array of { locale, slug } for all published versions
 */
export async function getPostTranslations(
    postId: string
): Promise<{ locale: string; slug: string }[]> {
    const translations = await db
        .select({ locale: blogPost.locale, slug: blogPost.slug })
        .from(blogPost)
        .where(
            and(
                eq(blogPost.postId, postId),
                eq(blogPost.published, true)
            )
        )
        .all();

    return translations;
}
