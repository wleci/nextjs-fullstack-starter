"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    FileText, Search, MoreHorizontal, Plus, Settings, Tag,
    ChevronLeft, ChevronRight, Loader2, Eye, EyeOff, Star,
    Trash2, Copy, Upload, Globe, Languages, Code2, Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "@/lib/auth/client";
import { useTranslation, useLocale } from "@/lib/i18n";
import {
    generateExampleJSON,
    type ParsedBlogPost,
    type LocalizedCategory,
    type BlogSettings,
    type BlogPostJSON,
} from "@/lib/blog";
import {
    getAdminBlogPosts,
    getAdminBlogSettings,
    getAdminCategories,
    upsertBlogPost,
    deleteBlogPost,
    togglePostPublished,
    togglePostFeatured,
} from "@/lib/blog/actions";
import { WysiwygEditor } from "@/components/editor/wysiwyg-editor";
import { htmlToContentBlocks } from "@/lib/blog/html-converter";
import { nanoid } from "nanoid";

const PAGE_SIZE = 20;

interface GroupedPost {
    postId: string;
    translations: ParsedBlogPost[];
    title: string;
    slug: string;
    featured: boolean;
    published: boolean;
    createdAt: Date;
}

export default function AdminBlogPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const { locale } = useLocale();
    const { t } = useTranslation();

    const [posts, setPosts] = useState<ParsedBlogPost[]>([]);
    const [categories, setCategories] = useState<LocalizedCategory[]>([]);
    const [settings, setSettings] = useState<BlogSettings | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Import dialog
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [jsonInput, setJsonInput] = useState("");
    const [importError, setImportError] = useState("");
    const [editorMode, setEditorMode] = useState<"visual" | "json">("visual");
    const [editingPostId, setEditingPostId] = useState<string | null>(null);

    // Visual editor state
    const [visualPostId, setVisualPostId] = useState("");
    const [visualSlug, setVisualSlug] = useState("");
    const [visualTitle, setVisualTitle] = useState("");
    const [visualExcerpt, setVisualExcerpt] = useState("");
    const [visualContent, setVisualContent] = useState("");
    const [visualLocale, setVisualLocale] = useState("pl");
    const [visualCategories, setVisualCategories] = useState<string[]>([]);
    const [visualCoverImage, setVisualCoverImage] = useState("");
    const [visualFeatured, setVisualFeatured] = useState(false);
    const [visualPublished, setVisualPublished] = useState(false);

    // Delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    const userRole = session?.user?.role;

    // Group posts by postId
    const groupedPosts = useMemo(() => {
        const groups = new Map<string, ParsedBlogPost[]>();

        posts.forEach((post) => {
            const existing = groups.get(post.postId) || [];
            existing.push(post);
            groups.set(post.postId, existing);
        });

        const result: GroupedPost[] = [];
        groups.forEach((translations, postId) => {
            // Sort translations by locale for consistent display
            translations.sort((a, b) => a.locale.localeCompare(b.locale));

            // Use first translation for main info (prefer current locale)
            const mainPost = translations.find((p) => p.locale === locale) || translations[0];

            result.push({
                postId,
                translations,
                title: mainPost.title,
                slug: mainPost.slug,
                featured: translations.some((p) => p.featured),
                published: translations.every((p) => p.published),
                createdAt: mainPost.createdAt,
            });
        });

        // Sort by createdAt desc
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return result;
    }, [posts, locale]);

    const fetchData = useCallback(async () => {
        if (userRole !== "admin") return;

        setIsLoading(true);
        try {
            const [postsData, settingsData, categoriesData] = await Promise.all([
                getAdminBlogPosts({ page, limit: PAGE_SIZE * 2, search: search || undefined }),
                getAdminBlogSettings(),
                getAdminCategories(locale),
            ]);

            setPosts(postsData.posts);
            setTotal(postsData.total);
            setSettings(settingsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userRole, page, search, locale]);

    useEffect(() => {
        if (!isPending) {
            if (!session) {
                router.replace("/" + locale + "/auth/login");
            } else if (userRole !== "admin") {
                router.replace("/" + locale + "/dashboard");
            }
        }
    }, [isPending, session, userRole, router, locale]);

    useEffect(() => {
        if (userRole === "admin") {
            fetchData();
        }
    }, [userRole, fetchData]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchData();
    };

    const handleImport = async () => {
        setImportError("");
        setIsProcessing(true);

        try {
            let json: BlogPostJSON;

            if (editorMode === "visual") {
                // Convert visual editor data to JSON
                const contentBlocks = htmlToContentBlocks(visualContent);

                json = {
                    postId: visualPostId || nanoid(8),
                    translations: [
                        {
                            locale: visualLocale,
                            slug: visualSlug,
                            title: visualTitle,
                            excerpt: visualExcerpt || undefined,
                            content: contentBlocks,
                            categories: visualCategories.length > 0 ? visualCategories : undefined,
                        },
                    ],
                    coverImage: visualCoverImage || undefined,
                    featured: visualFeatured,
                    published: visualPublished,
                };
            } else {
                // Parse JSON input
                json = JSON.parse(jsonInput) as BlogPostJSON;
            }

            await upsertBlogPost(json);
            setImportDialogOpen(false);
            resetEditorState();
            fetchData();
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("Invalid categories")) {
                    setImportError(error.message);
                } else if (error.message.includes("JSON")) {
                    setImportError("Nieprawidłowy format JSON. Sprawdź składnię.");
                } else {
                    setImportError(error.message || t("admin.blog.importError"));
                }
            } else {
                setImportError(t("admin.blog.importError"));
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const resetEditorState = () => {
        setJsonInput("");
        setVisualPostId("");
        setVisualSlug("");
        setVisualTitle("");
        setVisualExcerpt("");
        setVisualContent("");
        setVisualLocale("pl");
        setVisualCategories([]);
        setVisualCoverImage("");
        setVisualFeatured(false);
        setVisualPublished(false);
        setEditingPostId(null);
    };

    const handleEditJson = (group: GroupedPost) => {
        // Convert grouped post to JSON format
        const json: BlogPostJSON = {
            postId: group.postId,
            translations: group.translations.map((tr) => ({
                locale: tr.locale,
                slug: tr.slug,
                title: tr.title,
                excerpt: tr.excerpt || undefined,
                content: tr.content,
                categories: tr.categories || undefined,
            })),
            coverImage: group.translations[0]?.coverImage || undefined,
            featured: group.featured,
            published: group.published,
        };

        setJsonInput(JSON.stringify(json, null, 2));
        setEditorMode("json");
        setEditingPostId(group.postId);
        setImportDialogOpen(true);
    };

    const handleCopyExample = () => {
        const example = generateExampleJSON();
        navigator.clipboard.writeText(JSON.stringify(example, null, 2));
    };

    const handleTogglePublished = async (id: string) => {
        setIsProcessing(true);
        try {
            await togglePostPublished(id);
            fetchData();
        } catch (error) {
            console.error("Failed to toggle published:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleToggleFeatured = async (id: string) => {
        setIsProcessing(true);
        try {
            await togglePostFeatured(id);
            fetchData();
        } catch (error) {
            console.error("Failed to toggle featured:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedPostId) return;

        setIsProcessing(true);
        try {
            await deleteBlogPost(selectedPostId);
            setDeleteDialogOpen(false);
            setSelectedPostId(null);
            fetchData();
        } catch (error) {
            console.error("Failed to delete post:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const getLanguageColor = (loc: string) => {
        const colors: Record<string, string> = {
            pl: "#dc2626",
            en: "#2563eb",
            es: "#f59e0b",
            de: "#000000",
            fr: "#3b82f6",
            it: "#16a34a",
            pt: "#22c55e",
        };
        return colors[loc] ?? "#6366f1";
    };

    const totalPages = Math.ceil(total / PAGE_SIZE);

    if (isPending || !session || userRole !== "admin") {
        return null;
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary shrink-0" />
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold">{t("admin.blog.title")}</h1>
                        <p className="text-sm text-muted-foreground">{t("admin.blog.description")}</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/${locale}/admin/blog/categories`)}
                        className="w-full sm:w-auto"
                    >
                        <Tag className="h-4 w-4 mr-2" />
                        Kategorie
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/${locale}/admin/blog/settings`)}
                        className="w-full sm:w-auto"
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        Ustawienia
                    </Button>
                    <Button onClick={() => setImportDialogOpen(true)} className="w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        {t("admin.blog.createPost")}
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1 sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={t("admin.users.searchPlaceholder")}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button type="submit" variant="secondary">
                        {t("admin.users.search")}
                    </Button>
                </form>

                <div className="border rounded-lg overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[200px]">Title</TableHead>
                                <TableHead className="w-[140px]">
                                    <div className="flex items-center gap-1.5">
                                        <Languages className="h-4 w-4" />
                                        {t("admin.blog.locale")}
                                    </div>
                                </TableHead>
                                <TableHead className="w-[120px]">{t("admin.blog.status")}</TableHead>
                                <TableHead className="w-[80px]">{t("admin.blog.featured")}</TableHead>
                                <TableHead className="w-[80px] text-right">{t("admin.blog.actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : groupedPosts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                        {t("admin.blog.noPostsFound")}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                groupedPosts.map((group) => (
                                    <TableRow key={group.postId}>
                                        <TableCell>
                                            <div className="font-medium truncate max-w-[280px]">
                                                {group.title}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                ID: {group.postId}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {group.translations.map((tr) => (
                                                    <Badge
                                                        key={tr.id}
                                                        variant="outline"
                                                        className="text-xs cursor-default"
                                                        style={{
                                                            borderColor: getLanguageColor(tr.locale),
                                                            color: getLanguageColor(tr.locale),
                                                        }}
                                                        title={tr.title + " (/" + tr.slug + ")"}
                                                    >
                                                        {tr.locale.toUpperCase()}
                                                        {tr.published ? (
                                                            <Eye className="h-3 w-3 ml-1" />
                                                        ) : (
                                                            <EyeOff className="h-3 w-3 ml-1 opacity-50" />
                                                        )}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {group.published ? (
                                                <Badge className="gap-1 bg-green-100 text-green-700 hover:bg-green-100">
                                                    <Eye className="h-3 w-3" />
                                                    {t("admin.blog.published")}
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="gap-1">
                                                    <EyeOff className="h-3 w-3" />
                                                    {t("admin.blog.draft")}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {group.featured && (
                                                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>{t("admin.blog.actions")}</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleEditJson(group)}
                                                    >
                                                        <Code2 className="mr-2 h-4 w-4" />
                                                        Edytuj JSON
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {group.translations.map((tr) => (
                                                        <DropdownMenuItem
                                                            key={tr.id}
                                                            onClick={() => handleTogglePublished(tr.id)}
                                                        >
                                                            {tr.published ? (
                                                                <EyeOff className="mr-2 h-4 w-4" />
                                                            ) : (
                                                                <Eye className="mr-2 h-4 w-4" />
                                                            )}
                                                            {t("admin.blog.togglePublish")} ({tr.locale.toUpperCase()})
                                                        </DropdownMenuItem>
                                                    ))}
                                                    <DropdownMenuSeparator />
                                                    {group.translations.map((tr) => (
                                                        <DropdownMenuItem
                                                            key={tr.id + "-featured"}
                                                            onClick={() => handleToggleFeatured(tr.id)}
                                                        >
                                                            <Star className="mr-2 h-4 w-4" />
                                                            {t("admin.blog.toggleFeatured")} ({tr.locale.toUpperCase()})
                                                        </DropdownMenuItem>
                                                    ))}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedPostId(group.postId);
                                                            setDeleteDialogOpen(true);
                                                        }}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        {t("admin.blog.delete")} (wszystkie wersje)
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, total)} / {total}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm">{page} / {totalPages}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Import Dialog */}
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>
                            {editingPostId ? "Edytuj wpis" : t("admin.blog.createPost")}
                        </DialogTitle>
                        <DialogDescription>
                            {editingPostId
                                ? "Edytuj istniejący wpis używając edytora wizualnego lub JSON"
                                : "Utwórz nowy wpis używając edytora wizualnego lub importuj JSON"
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs value={editorMode} onValueChange={(v) => setEditorMode(v as "visual" | "json")} className="flex-1 overflow-hidden flex flex-col">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="visual" className="gap-2">
                                <Edit3 className="h-4 w-4" />
                                Edytor wizualny
                            </TabsTrigger>
                            <TabsTrigger value="json" className="gap-2">
                                <Code2 className="h-4 w-4" />
                                Import JSON
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="visual" className="flex-1 overflow-y-auto space-y-4 mt-4">
                            <div className="bg-muted/50 p-3 rounded-lg text-sm">
                                <p className="font-medium mb-1">💡 Edytor wizualny</p>
                                <p className="text-muted-foreground">
                                    Edytor obsługuje podstawowe bloki: paragrafy, nagłówki, listy, cytaty, kod, obrazki.
                                    Dla zaawansowanych bloków (tabele, quizy, schematy, matematyka) użyj trybu JSON.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="visual-title">Tytuł *</Label>
                                    <Input
                                        id="visual-title"
                                        value={visualTitle}
                                        onChange={(e) => setVisualTitle(e.target.value)}
                                        placeholder="Tytuł wpisu"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="visual-slug">Slug *</Label>
                                    <Input
                                        id="visual-slug"
                                        value={visualSlug}
                                        onChange={(e) => setVisualSlug(e.target.value)}
                                        placeholder="slug-wpisu"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="visual-locale">Język</Label>
                                    <select
                                        id="visual-locale"
                                        value={visualLocale}
                                        onChange={(e) => setVisualLocale(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="pl">Polski (PL)</option>
                                        <option value="en">English (EN)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="visual-postid">Post ID (opcjonalnie)</Label>
                                    <Input
                                        id="visual-postid"
                                        value={visualPostId}
                                        onChange={(e) => setVisualPostId(e.target.value)}
                                        placeholder="Zostaw puste dla auto-generowania"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="visual-excerpt">Excerpt (opcjonalnie)</Label>
                                <Textarea
                                    id="visual-excerpt"
                                    value={visualExcerpt}
                                    onChange={(e) => setVisualExcerpt(e.target.value)}
                                    placeholder="Krótki opis wpisu..."
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="visual-cover">Cover Image URL (opcjonalnie)</Label>
                                <Input
                                    id="visual-cover"
                                    value={visualCoverImage}
                                    onChange={(e) => setVisualCoverImage(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Kategorie</Label>
                                    {categories.length === 0 && (
                                        <Button
                                            type="button"
                                            variant="link"
                                            size="sm"
                                            className="h-auto p-0 text-xs"
                                            onClick={() => {
                                                router.push(`/${locale}/admin/blog/categories`);
                                            }}
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Utwórz pierwszą kategorię
                                        </Button>
                                    )}
                                </div>
                                {categories.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        Brak kategorii. Utwórz kategorie w zakładce "Kategorie".
                                    </p>
                                ) : (
                                    <div className="border rounded-md p-3 space-y-2 max-h-[200px] overflow-y-auto">
                                        {categories.map((cat) => (
                                            <div key={cat.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`cat-${cat.id}`}
                                                    checked={visualCategories.includes(cat.slug)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setVisualCategories([...visualCategories, cat.slug]);
                                                        } else {
                                                            setVisualCategories(visualCategories.filter(c => c !== cat.slug));
                                                        }
                                                    }}
                                                />
                                                <Label
                                                    htmlFor={`cat-${cat.id}`}
                                                    className="cursor-pointer flex items-center gap-2"
                                                >
                                                    <Badge
                                                        style={{
                                                            backgroundColor: (cat.color ?? "#6366f1") + "20",
                                                            color: cat.color ?? "#6366f1"
                                                        }}
                                                    >
                                                        {cat.name}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">({cat.slug})</span>
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="visual-published"
                                        checked={visualPublished}
                                        onCheckedChange={(checked) => setVisualPublished(checked === true)}
                                    />
                                    <Label htmlFor="visual-published">Opublikowany</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="visual-featured"
                                        checked={visualFeatured}
                                        onCheckedChange={(checked) => setVisualFeatured(checked === true)}
                                    />
                                    <Label htmlFor="visual-featured">Wyróżniony</Label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Treść wpisu *</Label>
                                <WysiwygEditor
                                    content={visualContent}
                                    onChange={setVisualContent}
                                    placeholder="Zacznij pisać treść wpisu..."
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="json" className="flex-1 overflow-hidden flex flex-col gap-4 mt-4">
                            <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-2">
                                <p className="font-medium">💡 Wskazówki:</p>
                                <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                                    <li>Kategorie muszą być najpierw utworzone w zakładce "Kategorie"</li>
                                    <li>W polu "categories" używaj slugów kategorii (np. ["tutorial", "dokumentacja"])</li>
                                    <li>Kliknij "Kopiuj przykład" aby zobaczyć format JSON</li>
                                </ul>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleCopyExample}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    {t("admin.blog.copyExample")}
                                </Button>
                            </div>
                            <div className="flex-1 min-h-0">
                                <Textarea
                                    value={jsonInput}
                                    onChange={(e) => setJsonInput(e.target.value)}
                                    placeholder={t("admin.blog.jsonPlaceholder")}
                                    className="font-mono text-xs h-[50vh] resize-none"
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    {importError && (
                        <p className="text-sm text-destructive">{importError}</p>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setImportDialogOpen(false);
                            resetEditorState();
                        }}>
                            Anuluj
                        </Button>
                        <Button
                            onClick={handleImport}
                            disabled={
                                isProcessing ||
                                (editorMode === "json" && !jsonInput) ||
                                (editorMode === "visual" && (!visualTitle || !visualSlug || !visualContent))
                            }
                        >
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Upload className="h-4 w-4 mr-2" />
                            {editingPostId
                                ? (editorMode === "visual" ? "Zaktualizuj wpis" : "Zaktualizuj z JSON")
                                : (editorMode === "visual" ? "Utwórz wpis" : t("admin.blog.importJson"))
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("admin.blog.delete")}</DialogTitle>
                        <DialogDescription>
                            {t("admin.blog.deleteConfirm")}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isProcessing}>
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t("admin.blog.delete")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
