"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Tag, Plus, Trash2, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "@/lib/auth/client";
import { useTranslation, useLocale } from "@/lib/i18n";
import type { LocalizedCategory } from "@/lib/blog";
import {
    getAdminCategories,
    createCategory,
    deleteCategory,
} from "@/lib/blog/actions";
import Link from "next/link";

export default function AdminBlogCategoriesPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const { locale } = useLocale();
    const { t } = useTranslation();

    const [categories, setCategories] = useState<LocalizedCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Category dialog
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [newCategorySlug, setNewCategorySlug] = useState("");
    const [newCategoryNameEn, setNewCategoryNameEn] = useState("");
    const [newCategoryNamePl, setNewCategoryNamePl] = useState("");
    const [newCategoryColor, setNewCategoryColor] = useState("#6366f1");
    const [categoryError, setCategoryError] = useState("");

    // Delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);

    const userRole = session?.user?.role;

    const fetchCategories = useCallback(async () => {
        if (userRole !== "admin") return;

        setIsLoading(true);
        try {
            const categoriesData = await getAdminCategories(locale);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userRole, locale]);

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
            fetchCategories();
        }
    }, [userRole, fetchCategories]);

    const handleAddCategory = async () => {
        if (!newCategorySlug || !newCategoryNameEn || !newCategoryNamePl) {
            setCategoryError("Wszystkie pola są wymagane");
            return;
        }

        // Validate slug format
        if (!/^[a-z0-9-]+$/.test(newCategorySlug)) {
            setCategoryError("Slug może zawierać tylko małe litery, cyfry i myślniki");
            return;
        }

        // Check if slug already exists
        if (categories.some(cat => cat.slug === newCategorySlug)) {
            setCategoryError("Kategoria o tym slug już istnieje");
            return;
        }

        setIsProcessing(true);
        setCategoryError("");
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
            fetchCategories();
        } catch (error) {
            console.error("Failed to add category:", error);
            setCategoryError("Nie udało się dodać kategorii");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!categoryToDelete) return;

        setIsProcessing(true);
        try {
            await deleteCategory(categoryToDelete.id);
            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
            fetchCategories();
        } catch (error) {
            console.error("Failed to delete category:", error);
            alert("Nie udało się usunąć kategorii");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isPending || !session || userRole !== "admin") {
        return null;
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href={`/${locale}/admin/blog`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <Tag className="h-8 w-8 text-primary shrink-0" />
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold">Kategorie bloga</h1>
                        <p className="text-sm text-muted-foreground">Zarządzaj kategoriami wpisów</p>
                    </div>
                </div>
                <Button onClick={() => setCategoryDialogOpen(true)} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj kategorię
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : categories.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                        <Tag className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Brak kategorii</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Dodaj pierwszą kategorię, aby móc przypisywać ją do wpisów
                        </p>
                        <Button onClick={() => setCategoryDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Dodaj kategorię
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((cat) => (
                        <Card key={cat.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <Badge
                                        style={{
                                            backgroundColor: (cat.color ?? "#6366f1") + "20",
                                            color: cat.color ?? "#6366f1"
                                        }}
                                    >
                                        {cat.name}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setCategoryToDelete({ id: cat.id, name: cat.name });
                                            setDeleteDialogOpen(true);
                                        }}
                                        disabled={isProcessing}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-1">
                                    <span className="font-medium">Slug:</span> {cat.slug}
                                </p>
                                <p className="text-sm text-muted-foreground mb-1">
                                    <span className="font-medium">EN:</span> {cat.nameEn}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium">PL:</span> {cat.namePl}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Category Dialog */}
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Dodaj kategorię</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input
                                id="slug"
                                value={newCategorySlug}
                                onChange={(e) => setNewCategorySlug(e.target.value.toLowerCase())}
                                placeholder="programowanie"
                            />
                            <p className="text-xs text-muted-foreground">
                                Tylko małe litery, cyfry i myślniki
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nameEn">Nazwa (EN) *</Label>
                            <Input
                                id="nameEn"
                                value={newCategoryNameEn}
                                onChange={(e) => setNewCategoryNameEn(e.target.value)}
                                placeholder="Programming"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="namePl">Nazwa (PL) *</Label>
                            <Input
                                id="namePl"
                                value={newCategoryNamePl}
                                onChange={(e) => setNewCategoryNamePl(e.target.value)}
                                placeholder="Programowanie"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="color">Kolor</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="color"
                                    type="color"
                                    value={newCategoryColor}
                                    onChange={(e) => setNewCategoryColor(e.target.value)}
                                    className="h-10 w-20"
                                />
                                <Input
                                    type="text"
                                    value={newCategoryColor}
                                    onChange={(e) => setNewCategoryColor(e.target.value)}
                                    placeholder="#6366f1"
                                />
                            </div>
                        </div>
                        {categoryError && (
                            <p className="text-sm text-destructive">{categoryError}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setCategoryDialogOpen(false);
                                setCategoryError("");
                            }}
                        >
                            Anuluj
                        </Button>
                        <Button onClick={handleAddCategory} disabled={isProcessing}>
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Dodaj
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Usuń kategorię</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Czy na pewno chcesz usunąć kategorię <span className="font-semibold">{categoryToDelete?.name}</span>?
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Ta akcja jest nieodwracalna. Posty z tą kategorią nie zostaną usunięte, ale stracą przypisanie do tej kategorii.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDeleteDialogOpen(false);
                                setCategoryToDelete(null);
                            }}
                            disabled={isProcessing}
                        >
                            Anuluj
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteCategory}
                            disabled={isProcessing}
                        >
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Usuń kategorię
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
