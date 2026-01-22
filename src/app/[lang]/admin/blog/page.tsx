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
    updateBlogSettings,
    createCategory,
    deleteCategory,
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

    // Category dialog
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [newCategorySlug, setNewCategorySlug] = useState("");
    const [newCategoryNameEn, setNewCategoryNameEn] = useState("");
    const [newCategoryNamePl, setNewCategoryNamePl] = useState("");
    const [newCategoryColor, setNewCategoryColor] = useState("#6366f1");

    // Settings
    const [blogEnabled, setBlogEnabled] = useState(true);
    const [postsPerPage, setPostsPerPage] = useState(12);
    const [showFeatured, setShowFeatured] = useState(true);

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
            setBlogEnabled(settingsData.enabled ?? true);
            setPostsPerPage(settingsData.postsPerPage ?? 12);
            setShowFeatured(settingsData.showFeatured ?? true);
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
            setImportError(t("admin.blog.importError"));
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

    const handleSaveSettings = async () => {
        setIsProcessing(true);
        try {
            await updateBlogSettings({
                enabled: blogEnabled,
                postsPerPage,
                showFeatured,
            });
        } catch (error) {
            console.error("Failed to save settings:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategorySlug || !newCategoryNameEn || !newCategoryNamePl) return;

        setIsProcessing(true);
        try {
            await createCategory({
                slug: newCategorySlug,
                nameEn: newCategoryNameEn,
                namePl: newCategoryNamePl,
                color: newCategoryColor,
            });
            setCategoryDialogOpen(false);
            setNewCategorySlug("");
            setNewCategoryNameEn("");
            setNewCategoryNamePl("");
            setNewCategoryColor("#6366f1");
            fetchData();
        } catch (error) {
            console.error("Failed to add category:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        setIsProcessing(true);
        try {
            await deleteCategory(id);
            fetchData();
        } catch (error) {
            console.error("Failed to delete category:", error);
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
                <Button onClick={() => setImportDialogOpen(true)} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("admin.blog.createPost")}
                </Button>
            </div>

            <Tabs defaultValue="posts">
                <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex">
                    <TabsTrigger value="posts" className="gap-2">
                        <FileText className="h-4 w-4" />
                        {t("admin.blog.posts")}
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="gap-2">
                        <Tag className="h-4 w-4" />
                        {t("admin.blog.categories")}
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2">
                        <Settings className="h-4 w-4" />
                        {t("admin.blog.settings")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="space-y-4">
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
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={() => setCategoryDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            {t("admin.blog.addCategory")}
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map((cat) => (
                            <Card key={cat.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <Badge style={{ backgroundColor: (cat.color ?? "#6366f1") + "20", color: cat.color ?? "#6366f1" }}>
                                            {cat.name}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteCategory(cat.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Slug: {cat.slug}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        EN: {cat.nameEn} | PL: {cat.namePl}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("admin.blog.settingsTitle")}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="blogEnabled"
                                    checked={blogEnabled}
                                    onCheckedChange={(checked) => setBlogEnabled(checked === true)}
                                />
                                <Label htmlFor="blogEnabled">{t("admin.blog.enableBlog")}</Label>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="postsPerPage">{t("admin.blog.postsPerPage")}</Label>
                                <Input
                                    id="postsPerPage"
                                    type="number"
                                    value={postsPerPage}
                                    onChange={(e) => setPostsPerPage(parseInt(e.target.value, 10))}
                                    className="max-w-[100px]"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="showFeatured"
                                    checked={showFeatured}
                                    onCheckedChange={(checked) => setShowFeatured(checked === true)}
                                />
                                <Label htmlFor="showFeatured">{t("admin.blog.showFeatured")}</Label>
                            </div>

                            <Button onClick={handleSaveSettings} disabled={isProcessing}>
                                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t("admin.blog.save")}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

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
                                <Label htmlFor="visual-categories">Kategorie (oddziel przecinkami)</Label>
                                <Input
                                    id="visual-categories"
                                    value={visualCategories.join(", ")}
                                    onChange={(e) => setVisualCategories(e.target.value.split(",").map(c => c.trim()).filter(Boolean))}
                                    placeholder="tutorial, dokumentacja"
                                />
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

            {/* Category Dialog */}
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("admin.blog.addCategory")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>{t("admin.blog.categorySlug")}</Label>
                            <Input
                                value={newCategorySlug}
                                onChange={(e) => setNewCategorySlug(e.target.value)}
                                placeholder="tutorial"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("admin.blog.categoryName")} (EN)</Label>
                            <Input
                                value={newCategoryNameEn}
                                onChange={(e) => setNewCategoryNameEn(e.target.value)}
                                placeholder="Tutorial"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("admin.blog.categoryName")} (PL)</Label>
                            <Input
                                value={newCategoryNamePl}
                                onChange={(e) => setNewCategoryNamePl(e.target.value)}
                                placeholder="Poradnik"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("admin.blog.categoryColor")}</Label>
                            <Input
                                type="color"
                                value={newCategoryColor}
                                onChange={(e) => setNewCategoryColor(e.target.value)}
                                className="h-10 w-20"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddCategory} disabled={isProcessing}>
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t("admin.blog.addCategory")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
