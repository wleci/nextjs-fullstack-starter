"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Calendar, User, ArrowRight, ChevronLeft, ChevronRight, Sparkles, BookOpen, SortAsc, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { ParsedBlogPost, LocalizedCategory } from "@/lib/blog";

interface Props {
    locale: string;
    featuredPost: ParsedBlogPost | null;
    posts: ParsedBlogPost[];
    categories: LocalizedCategory[];
    pagination: {
        page: number;
        totalPages: number;
        hasMore: boolean;
        total: number;
    };
    currentCategory?: string;
    currentSearch?: string;
    currentSort?: string;
    translations: {
        title: string;
        description: string;
        search: string;
        allCategories: string;
        featured: string;
        latestPosts: string;
        allPosts: string;
        readMore: string;
        readTime: string;
        by: string;
        noPosts: string;
        noPostsDescription: string;
        loadMore: string;
        nextPage: string;
        prevPage: string;
        page: string;
        of: string;
        sortBy: string;
        newest: string;
        oldest: string;
        clearFilters: string;
    };
}

export function BlogPageClient({
    locale,
    featuredPost,
    posts,
    categories,
    pagination,
    currentCategory,
    currentSearch,
    currentSort,
    translations: t,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(currentSearch ?? "");

    const hasActiveFilters = currentCategory || currentSearch;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchValue) {
            params.set("search", searchValue);
        } else {
            params.delete("search");
        }
        params.delete("page");
        router.push(`/${locale}/blog?${params.toString()}`);
    };

    const handleCategoryChange = (categorySlug: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (categorySlug) {
            params.set("category", categorySlug);
        } else {
            params.delete("category");
        }
        params.delete("page");
        router.push(`/${locale}/blog?${params.toString()}`);
    };

    const handleSortChange = (sort: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (sort && sort !== "newest") {
            params.set("sort", sort);
        } else {
            params.delete("sort");
        }
        params.delete("page");
        router.push(`/${locale}/blog?${params.toString()}`);
    };

    const handleClearFilters = () => {
        router.push(`/${locale}/blog`);
        setSearchValue("");
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`/${locale}/blog?${params.toString()}`);
    };

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero Section */}
            <div className="border-b bg-background/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-10 md:py-14">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            <BookOpen className="h-4 w-4" />
                            {t.title}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                            {t.description}
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {locale === "pl"
                                ? "Odkryj najnowsze wpisy, poradniki i inspiracje"
                                : "Discover the latest posts, tutorials and inspiration"
                            }
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Filters Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-6xl mx-auto mb-8"
                >
                    <Card className="border-muted-foreground/10">
                        <CardContent className="p-4 md:p-6">
                            <div className="flex flex-col gap-4">
                                {/* Search and Sort Row */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <form onSubmit={handleSearch} className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder={t.search}
                                                value={searchValue}
                                                onChange={(e) => setSearchValue(e.target.value)}
                                                className="pl-10 h-10"
                                            />
                                        </div>
                                    </form>
                                    <div className="flex gap-2">
                                        <Select value={currentSort ?? "newest"} onValueChange={handleSortChange}>
                                            <SelectTrigger className="w-[160px] h-10">
                                                <SortAsc className="h-4 w-4 mr-2" />
                                                <SelectValue placeholder={t.sortBy} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="newest">{t.newest}</SelectItem>
                                                <SelectItem value="oldest">{t.oldest}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {hasActiveFilters && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={handleClearFilters}
                                                className="h-10 w-10 shrink-0"
                                                title={t.clearFilters}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Categories Row */}
                                {categories.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Tag className="h-4 w-4" />
                                            <span>{locale === "pl" ? "Kategorie" : "Categories"}:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                variant={!currentCategory ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleCategoryChange(null)}
                                                className="rounded-full h-8"
                                            >
                                                {t.allCategories}
                                            </Button>
                                            {categories.map((cat) => (
                                                <Button
                                                    key={cat.id}
                                                    variant={currentCategory === cat.slug ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handleCategoryChange(cat.slug)}
                                                    className="rounded-full h-8"
                                                    style={{
                                                        borderColor: currentCategory === cat.slug ? undefined : (cat.color ?? undefined),
                                                        color: currentCategory === cat.slug ? undefined : (cat.color ?? undefined),
                                                        backgroundColor: currentCategory === cat.slug ? (cat.color ?? undefined) : undefined,
                                                    }}
                                                >
                                                    {cat.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Active Filters Display */}
                                {hasActiveFilters && (
                                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t">
                                        <span className="text-sm text-muted-foreground">
                                            {locale === "pl" ? "Aktywne filtry:" : "Active filters:"}
                                        </span>
                                        {currentSearch && (
                                            <Badge variant="secondary" className="gap-1">
                                                <Search className="h-3 w-3" />
                                                {currentSearch}
                                                <button
                                                    onClick={() => {
                                                        setSearchValue("");
                                                        const params = new URLSearchParams(searchParams.toString());
                                                        params.delete("search");
                                                        params.delete("page");
                                                        router.push(`/${locale}/blog?${params.toString()}`);
                                                    }}
                                                    className="ml-1 hover:text-destructive"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        )}
                                        {currentCategory && (
                                            <Badge
                                                variant="secondary"
                                                className="gap-1"
                                                style={{
                                                    backgroundColor: getCategoryColor(currentCategory) + "20",
                                                    color: getCategoryColor(currentCategory),
                                                }}
                                            >
                                                <Tag className="h-3 w-3" />
                                                {getCategoryName(currentCategory)}
                                                <button
                                                    onClick={() => handleCategoryChange(null)}
                                                    className="ml-1 hover:opacity-70"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Featured Post */}
                {featuredPost && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-5xl mx-auto mb-12"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                            <h2 className="text-lg font-semibold">{t.featured}</h2>
                        </div>
                        <Link href={`/${locale}/blog/${featuredPost.slug}`}>
                            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 bg-gradient-to-br from-card to-muted/50">
                                <div className="grid md:grid-cols-2">
                                    <div className="aspect-[4/3] md:aspect-auto md:min-h-[280px] overflow-hidden bg-muted flex items-center justify-center">
                                        {featuredPost.coverImage ? (
                                            <img
                                                src={featuredPost.coverImage}
                                                alt={featuredPost.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 ${featuredPost.coverImage ? 'hidden' : ''}`}>
                                            <BookOpen className="h-16 w-16 text-primary/40 mb-2" />
                                            <span className="text-sm text-muted-foreground">No image</span>
                                        </div>
                                    </div>
                                    <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {featuredPost.categories.map((cat) => (
                                                <Badge
                                                    key={cat}
                                                    variant="secondary"
                                                    className="rounded-full"
                                                    style={{
                                                        backgroundColor: getCategoryColor(cat) + "15",
                                                        color: getCategoryColor(cat),
                                                    }}
                                                >
                                                    {getCategoryName(cat)}
                                                </Badge>
                                            ))}
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                                            {featuredPost.title}
                                        </h3>
                                        {featuredPost.excerpt && (
                                            <p className="text-muted-foreground mb-4 line-clamp-2">
                                                {featuredPost.excerpt}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            {featuredPost.authorName && (
                                                <span className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    {featuredPost.authorName}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {formatDate(featuredPost.publishedAt)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>
                )}

                {/* Posts Grid */}
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-2 mb-6">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold">
                            {currentCategory || currentSearch ? t.allPosts : t.latestPosts}
                        </h2>
                        {pagination.total > 0 && (
                            <Badge variant="secondary" className="ml-2 rounded-full">
                                {pagination.total}
                            </Badge>
                        )}
                    </div>

                    {posts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16 bg-muted/30 rounded-2xl"
                        >
                            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                            <p className="text-lg font-medium mb-1">{t.noPosts}</p>
                            <p className="text-muted-foreground text-sm">{t.noPostsDescription}</p>
                        </motion.div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                >
                                    <Link href={`/${locale}/blog/${post.slug}`}>
                                        <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group border-muted-foreground/10 hover:border-primary/20">
                                            <div className="aspect-[16/10] overflow-hidden bg-muted flex items-center justify-center relative">
                                                {(post.badgeText || post.featured) && (
                                                    <div className="absolute top-2 left-2 z-10">
                                                        {post.badgeText ? (
                                                            <Badge
                                                                className="text-white gap-1 rounded-full text-xs"
                                                                style={{ backgroundColor: post.badgeColor ?? "#6366f1" }}
                                                            >
                                                                {post.badgeText}
                                                            </Badge>
                                                        ) : post.featured ? (
                                                            <Badge className="bg-amber-500 hover:bg-amber-500 text-white gap-1 rounded-full text-xs">
                                                                <Sparkles className="h-3 w-3" />
                                                                {t.featured}
                                                            </Badge>
                                                        ) : null}
                                                    </div>
                                                )}
                                                {post.coverImage ? (
                                                    <img
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 ${post.coverImage ? 'hidden' : ''}`}>
                                                    <BookOpen className="h-10 w-10 text-primary/30 mb-1" />
                                                    <span className="text-xs text-muted-foreground">No image</span>
                                                </div>
                                            </div>
                                            <CardContent className="p-4">
                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    {post.categories.slice(0, 2).map((cat) => (
                                                        <Badge
                                                            key={cat}
                                                            variant="secondary"
                                                            className="text-xs rounded-full px-2 py-0"
                                                            style={{
                                                                backgroundColor: getCategoryColor(cat) + "15",
                                                                color: getCategoryColor(cat)
                                                            }}
                                                        >
                                                            {getCategoryName(cat)}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                                                    {post.title}
                                                </h3>
                                                {post.excerpt && (
                                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                        {post.excerpt}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {formatDate(post.publishedAt)}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
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
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-4 mt-10"
                    >
                        <Button
                            variant="outline"
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="rounded-full"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            {t.prevPage}
                        </Button>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
                                .map((p, idx, arr) => (
                                    <span key={p} className="flex items-center gap-2">
                                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                                            <span className="text-muted-foreground">...</span>
                                        )}
                                        <Button
                                            variant={p === pagination.page ? "default" : "ghost"}
                                            size="sm"
                                            onClick={() => handlePageChange(p)}
                                            className="w-10 h-10 rounded-full"
                                        >
                                            {p}
                                        </Button>
                                    </span>
                                ))}
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={!pagination.hasMore}
                            className="rounded-full"
                        >
                            {t.nextPage}
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
