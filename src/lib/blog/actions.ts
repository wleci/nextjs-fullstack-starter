"use server";

import { db } from "@/lib/database";
import { blogPost, blogCategory, blogSettings } from "./schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { BlogPostJSON, ContentBlock } from "./types";
import { nanoid } from "nanoid";

/**
 * Check if user is admin
 */
async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }
    return session;
}

/**
 * Update blog settings
 */
export async function updateBlogSettings(data: {
    enabled?: boolean;
    postsPerPage?: number;
    showFeatured?: boolean;
}) {
    await requireAdmin();

    const existing = await db.select().from(blogSettings).where(eq(blogSettings.id, "default")).get();

    if (existing) {
        await db.update(blogSettings).set(data).where(eq(blogSettings.id, "default"));
    } else {
        await db.insert(blogSettings).values({ id: "default", ...data });
    }

    revalidatePath("/[lang]/blog", "page");
    return { success: true };
}

/**
 * Create or update blog post from JSON
 */
export async function upsertBlogPost(json: BlogPostJSON) {
    const session = await requireAdmin();

    // Validate categories exist in database
    if (json.translations.some(t => t.categories && t.categories.length > 0)) {
        const allCategories = await db.select().from(blogCategory).all();
        const validSlugs = new Set(allCategories.map(c => c.slug));

        for (const translation of json.translations) {
            if (translation.categories) {
                const invalidCategories = translation.categories.filter(cat => !validSlugs.has(cat));
                if (invalidCategories.length > 0) {
                    throw new Error(
                        `Invalid categories: ${invalidCategories.join(", ")}. ` +
                        `Please create these categories first in the Categories tab.`
                    );
                }
            }
        }
    }

    for (const translation of json.translations) {
        const id = `${json.postId}_${translation.locale}`;
        const contentString = JSON.stringify(translation.content);
        const categoriesString = translation.categories?.join(",") ?? "";

        const existing = await db.select().from(blogPost).where(eq(blogPost.id, id)).get();

        const postData = {
            postId: json.postId,
            locale: translation.locale,
            slug: translation.slug,
            title: translation.title,
            excerpt: translation.excerpt ?? null,
            content: contentString,
            coverImage: json.coverImage ?? null,
            categories: categoriesString,
            badgeText: translation.badgeText ?? null,
            badgeColor: translation.badgeColor ?? null,
            featured: json.featured ?? false,
            published: json.published ?? false,
            publishedAt: json.published ? new Date() : null,
            authorId: session.user.id,
            authorName: json.authorName ?? session.user.name,
        };

        if (existing) {
            await db.update(blogPost).set(postData).where(eq(blogPost.id, id));
        } else {
            await db.insert(blogPost).values({ id, ...postData });
        }
    }

    revalidatePath("/[lang]/blog", "page");
    return { success: true, postId: json.postId };
}

/**
 * Delete blog post (all translations)
 */
export async function deleteBlogPost(postId: string) {
    await requireAdmin();

    await db.delete(blogPost).where(eq(blogPost.postId, postId));

    revalidatePath("/[lang]/blog", "page");
    return { success: true };
}

/**
 * Toggle post published status
 */
export async function togglePostPublished(id: string) {
    await requireAdmin();

    const post = await db.select().from(blogPost).where(eq(blogPost.id, id)).get();
    if (!post) throw new Error("Post not found");

    const newPublished = !post.published;
    await db.update(blogPost).set({
        published: newPublished,
        publishedAt: newPublished ? new Date() : null,
    }).where(eq(blogPost.id, id));

    revalidatePath("/[lang]/blog", "page");
    return { success: true, published: newPublished };
}

/**
 * Toggle post featured status
 */
export async function togglePostFeatured(id: string) {
    await requireAdmin();

    const post = await db.select().from(blogPost).where(eq(blogPost.id, id)).get();
    if (!post) throw new Error("Post not found");

    await db.update(blogPost).set({ featured: !post.featured }).where(eq(blogPost.id, id));

    revalidatePath("/[lang]/blog", "page");
    return { success: true, featured: !post.featured };
}

/**
 * Create category
 */
export async function createCategory(data: {
    slug: string;
    nameEn: string;
    namePl: string;
    color?: string;
}) {
    await requireAdmin();

    const id = nanoid();
    await db.insert(blogCategory).values({ id, ...data });

    return { success: true, id };
}

/**
 * Update category
 */
export async function updateCategory(id: string, data: {
    slug?: string;
    nameEn?: string;
    namePl?: string;
    color?: string;
}) {
    await requireAdmin();

    await db.update(blogCategory).set(data).where(eq(blogCategory.id, id));

    revalidatePath("/[lang]/blog", "page");
    return { success: true };
}

/**
 * Delete category
 */
export async function deleteCategory(id: string) {
    await requireAdmin();

    await db.delete(blogCategory).where(eq(blogCategory.id, id));

    return { success: true };
}

/**
 * Get all posts for admin panel (server action wrapper)
 */
export async function getAdminBlogPosts(options: {
    page?: number;
    limit?: number;
    search?: string;
}) {
    await requireAdmin();

    const { getAllBlogPosts } = await import("./queries");
    return getAllBlogPosts(options);
}

/**
 * Get blog settings (server action wrapper)
 */
export async function getAdminBlogSettings() {
    await requireAdmin();

    const { getBlogSettings } = await import("./queries");
    return getBlogSettings();
}

/**
 * Get categories (server action wrapper)
 */
export async function getAdminCategories(locale: string) {
    await requireAdmin();

    const { getCategories } = await import("./queries");
    return getCategories(locale);
}
