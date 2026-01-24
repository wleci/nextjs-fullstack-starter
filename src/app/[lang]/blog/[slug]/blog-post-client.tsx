"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Share2, ArrowRight, BookOpen, Clock, Globe, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BlockRenderer } from "@/lib/blog/blocks";
import { ViewTracker } from "@/components/blog/view-tracker";
import type { ParsedBlogPost, LocalizedCategory } from "@/lib/blog";

interface Props {
    locale: string;
    post: ParsedBlogPost;
    relatedPosts: ParsedBlogPost[];
    categories: LocalizedCategory[];
    translations: {
        readTime: string;
        by: string;
        relatedPosts: string;
        sharePost: string;
        backToBlog: string;
        readMore: string;
        availableIn: string;
    };
    otherTranslations: { locale: string; slug: string }[];
}

export function BlogPostClient({
    locale,
    post,
    relatedPosts,
    categories,
    translations: t,
    otherTranslations,
}: Props) {
    const pathname = usePathname();
    // Extract current slug from pathname (format: /lang/blog/slug)
    const currentSlug = pathname.split("/").pop() ?? post.slug;

    const formatDate = (date: Date | null) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getCategoryName = (slug: string) => {
        const cat = categories.find((c) => c.slug === slug);
        return cat?.name ?? slug;
    };

    const getCategoryColor = (slug: string) => {
        const cat = categories.find((c) => c.slug === slug);
        return cat?.color ?? "#6366f1";
    };

    const getLanguageName = (code: string) => {
        const names: Record<string, string> = {
            pl: "Polski",
            en: "English",
            es: "Español",
            de: "Deutsch",
            fr: "Français",
            it: "Italiano",
            pt: "Português",
        };
        return names[code] ?? code.toUpperCase();
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: post.title,
                text: post.excerpt ?? "",
                url: window.location.href,
            });
        } else {
            await navigator.clipboard.writeText(window.location.href);
        }
    };

    // Estimate read time (roughly 200 words per minute)
    const wordCount = post.content.reduce((acc, block) => {
        if ("content" in block && typeof block.content === "string") {
            return acc + block.content.split(/\s+/).length;
        }
        if ("code" in block && typeof block.code === "string") {
            return acc + block.code.split(/\s+/).length;
        }
        return acc;
    }, 0);
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <div className="min-h-screen bg-background">
            {/* View Tracker - invisible component that tracks views every 1 minute */}
            <ViewTracker postId={post.id} />
            
            {/* Hero */}
            <div className="relative overflow-hidden">
                {post.coverImage ? (
                    <div className="absolute inset-0 h-[500px]">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.parentElement?.classList.add('hidden');
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
                    </div>
                ) : (
                    <div className="absolute inset-0 h-[300px] bg-gradient-to-b from-muted/50 to-background" />
                )}

                <div className="container mx-auto px-4 pt-8 pb-16 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <Link href={`/${locale}/blog`}>
                            <Button variant="ghost" size="sm" className="mb-8 -ml-2 hover:bg-background/50">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t.backToBlog}
                            </Button>
                        </Link>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {post.categories.map((cat) => (
                                <Badge
                                    key={cat}
                                    className="rounded-full px-3 py-1"
                                    style={{
                                        backgroundColor: getCategoryColor(cat) + "20",
                                        color: getCategoryColor(cat),
                                        borderColor: getCategoryColor(cat) + "40",
                                    }}
                                >
                                    {getCategoryName(cat)}
                                </Badge>
                            ))}
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            {post.title}
                        </h1>

                        {post.excerpt && (
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                {post.excerpt}
                            </p>
                        )}

                        {/* Language switcher */}
                        {otherTranslations.length > 0 && (
                            <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-muted/50 border">
                                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="text-sm text-muted-foreground">{t.availableIn}:</span>
                                <div className="flex flex-wrap gap-2">
                                    {otherTranslations.map((tr) => (
                                        <Link key={tr.locale} href={`/${tr.locale}/blog/${currentSlug}`}>
                                            <Badge
                                                variant="outline"
                                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                            >
                                                {getLanguageName(tr.locale)}
                                            </Badge>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                            {post.authorName && (
                                <span className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <span>
                                        <span className="text-muted-foreground/70">{t.by}</span>{" "}
                                        <span className="font-medium text-foreground">{post.authorName}</span>
                                    </span>
                                </span>
                            )}
                            <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(post.publishedAt)}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {readTime} {t.readTime}
                            </span>
                            {post.views > 0 && (
                                <span className="flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    {post.views.toLocaleString(locale)}
                                </span>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleShare}
                                className="ml-auto"
                            >
                                <Share2 className="h-4 w-4 mr-2" />
                                {t.sharePost}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
                        <BlockRenderer blocks={post.content} />
                    </div>
                </motion.article>

                {/* Tags */}
                {post.categories.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-3xl mx-auto mt-12 pt-8 border-t"
                    >
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm text-muted-foreground">Tags:</span>
                            {post.categories.map((cat) => (
                                <Link key={cat} href={`/${locale}/blog?category=${cat}`}>
                                    <Badge
                                        variant="outline"
                                        className="rounded-full hover:bg-muted transition-colors cursor-pointer"
                                    >
                                        {getCategoryName(cat)}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="max-w-5xl mx-auto mt-16 pt-12 border-t"
                    >
                        <div className="flex items-center gap-2 mb-8">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <h2 className="text-2xl font-bold">{t.relatedPosts}</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost, index) => (
                                <motion.div
                                    key={relatedPost.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                >
                                    <Link href={`/${locale}/blog/${relatedPost.slug}`}>
                                        <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group">
                                            <div className="aspect-[16/10] overflow-hidden bg-muted flex items-center justify-center">
                                                {relatedPost.coverImage ? (
                                                    <img
                                                        src={relatedPost.coverImage}
                                                        alt={relatedPost.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 ${relatedPost.coverImage ? 'hidden' : ''}`}>
                                                    <BookOpen className="h-10 w-10 text-primary/30 mb-1" />
                                                    <span className="text-xs text-muted-foreground">No image</span>
                                                </div>
                                            </div>
                                            <CardContent className="p-5">
                                                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-3">
                                                    {relatedPost.title}
                                                </h3>
                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {formatDate(relatedPost.publishedAt)}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-primary font-medium">
                                                        {t.readMore}
                                                        <ArrowRight className="h-3.5 w-3.5" />
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
