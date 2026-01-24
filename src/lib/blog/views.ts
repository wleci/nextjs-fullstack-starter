"use server";

import { db } from "@/lib/database";
import { blogPost } from "@/lib/blog/schema";
import { eq, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

/**
 * Track blog post view - increments view count
 * This should be called periodically (e.g., every 1 minute) to avoid excessive DB writes
 */
export async function trackBlogView(postId: string) {
    try {
        await db
            .update(blogPost)
            .set({
                views: sql`${blogPost.views} + 1`,
            })
            .where(eq(blogPost.id, postId));

        return { success: true };
    } catch (error) {
        console.error("Failed to track blog view:", error);
        return { success: false };
    }
}

/**
 * Get view count for a blog post
 */
export async function getBlogViewCount(postId: string): Promise<number> {
    try {
        const result = await db
            .select({ views: blogPost.views })
            .from(blogPost)
            .where(eq(blogPost.id, postId))
            .limit(1);

        return result[0]?.views ?? 0;
    } catch (error) {
        console.error("Failed to get blog view count:", error);
        return 0;
    }
}

/**
 * Get most viewed posts
 */
export async function getMostViewedPosts(locale: string, limit = 10) {
    try {
        const posts = await db
            .select({
                id: blogPost.id,
                slug: blogPost.slug,
                title: blogPost.title,
                views: blogPost.views,
                coverImage: blogPost.coverImage,
            })
            .from(blogPost)
            .where(eq(blogPost.locale, locale))
            .orderBy(desc(blogPost.views))
            .limit(limit);

        return posts;
    } catch (error) {
        console.error("Failed to get most viewed posts:", error);
        return [];
    }
}
