import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

/**
 * Blog posts table - stores localized blog posts
 * ID format: {postId}_{locale} (e.g., "1_pl", "1_en")
 */
export const blogPost = sqliteTable("blog_post", {
    id: text("id").primaryKey(),
    postId: text("post_id").notNull(),
    locale: text("locale").notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    coverImage: text("cover_image"),
    categories: text("categories"),
    badgeColor: text("badge_color"),
    badgeText: text("badge_text"),
    featured: integer("featured", { mode: "boolean" }).default(false),
    published: integer("published", { mode: "boolean" }).default(false),
    publishedAt: integer("published_at", { mode: "timestamp_ms" }),
    authorId: text("author_id"),
    authorName: text("author_name"),
    views: integer("views").default(0).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => [
    index("blog_post_slug_idx").on(table.slug),
    index("blog_post_locale_idx").on(table.locale),
    index("blog_post_postId_idx").on(table.postId),
    index("blog_post_published_idx").on(table.published),
    index("blog_post_featured_idx").on(table.featured),
]);

/**
 * Blog categories table
 */
export const blogCategory = sqliteTable("blog_category", {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    nameEn: text("name_en").notNull(),
    namePl: text("name_pl").notNull(),
    color: text("color").default("#6366f1"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .notNull(),
}, (table) => [
    index("blog_category_slug_idx").on(table.slug),
]);

/**
 * Blog settings table - stores global blog configuration
 */
export const blogSettings = sqliteTable("blog_settings", {
    id: text("id").primaryKey().default("default"),
    enabled: integer("enabled", { mode: "boolean" }).default(true),
    postsPerPage: integer("posts_per_page").default(12),
    showFeatured: integer("show_featured", { mode: "boolean" }).default(true),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .$onUpdate(() => new Date())
        .notNull(),
});

export const blogPostRelations = relations(blogPost, ({ }) => ({}));
export const blogCategoryRelations = relations(blogCategory, ({ }) => ({}));

export type BlogPost = typeof blogPost.$inferSelect;
export type NewBlogPost = typeof blogPost.$inferInsert;
export type BlogCategory = typeof blogCategory.$inferSelect;
export type NewBlogCategory = typeof blogCategory.$inferInsert;
export type BlogSettings = typeof blogSettings.$inferSelect;
