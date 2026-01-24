"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Tag, Plus, ArrowLeft, Loader2, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSession } from "@/lib/auth/client";
import { useLocale } from "@/lib/i18n";
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from "@/lib/blog/actions";
import type { LocalizedCategory } from "@/lib/blog";

export default function CategoriesPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const { locale } = useLocale();

    const [categories, setCategories] = useState<LocalizedCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Add/Edit dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [categorySlug, setCategorySlug] = useState("");
    const [categoryNameEn, setCategoryNameEn] = useState("");
    const [categoryNamePl, setCategoryNamePl] = useState("");
    const [categoryColor, setCategoryColor] = useState("#3b82f6");

    // Delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const userRole = session?.user?.role;

    const fetchCategories = useCallback(async () => {
        if (userRole !== "admin") return;

        setIsLoading(true);
        setError(null);
        try {
            const data = await getAdminCategories(locale);
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setError("Nie udało się pobrać kategorii");
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

    const resetForm = () => {
        setEditingId(null);
        setCategorySlug("");
        setCategoryNameEn("");
        setCategoryNamePl("");
        setCategoryColor("#3b82f6");
    };

    const handleOpenAdd = () => {
        resetForm();
        setDialogOpen(true);
    };

    const handleOpenEdit = (category: LocalizedCategory) => {
        setEditingId(category.id);
        setCategorySlug(category.slug);
        setCategoryNameEn(category.nameEn);
        setCategoryNamePl(category.namePl);
        setCategoryColor(category.color || "#3b82f6");
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!categorySlug || !categoryNameEn || !categoryNamePl) {
            setError("Wypełnij wszystkie pola");
            return;
        }

        setIsProcessing(true);
        setError(null);
        try {
            if (editingId) {
                await updateCategory(editingId, {
                    slug: categorySlug,
                    nameEn: categoryNameEn,
                    namePl: categoryNamePl,
                    color: categoryColor,
                });
            } else {
                await createCategory({
                    slug: categorySlug,
                    nameEn: categoryNameEn,
                    namePl: categoryNamePl,
                    color: categoryColor,
                });
            }
            setDialogOpen(false);
            resetForm();
            fetchCategories();
        } catch (error) {
            console.error("Failed to save category:", error);
            setError(error instanceof Error ? error.message : "Nie udało się zapisać kategorii");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleOpenDelete = (id: string) => {
        setDeletingId(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!deletingId) return;

        setIsProcessing(true);
        setError(null);
        try {
            await deleteCategory(deletingId);
            setDeleteDialogOpen(false);
            setDeletingId(null);
            fetchCategories();
        } catch (error) {
            console.error("Failed to delete category:", error);
            setError(error instanceof Error ? error.message : "Nie udało się usunąć kategorii");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isPending || !session || userRole !== "admin") {
        return null;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/${locale}/admin/blog`)}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <Tag className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold">Kategorie bloga</h1>
                            <p className="text-sm text-muted-foreground">
                                Zarządzaj kategoriami wpisów
                            </p>
                        </div>
                    </div>
                </div>
                <Button onClick={handleOpenAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj kategorię
                </Button>
            </div>

            {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Dostępne kategorie ({categories.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="space-y-2 text-center py-8">
                            <p className="text-sm text-muted-foreground">
                                Brak kategorii
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Dodaj pierwszą kategorię używając przycisku powyżej
                            </p>
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Tłumaczenia</TableHead>
                                        <TableHead>Kolor</TableHead>
                                        <TableHead className="w-[100px]">Akcje</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell>
                                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                                    {category.id}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    style={{
                                                        backgroundColor: category.color || "#6366f1",
                                                        color: "#fff",
                                                    }}
                                                >
                                                    {category.slug}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-2">
                                                    {category.nameEn && (
                                                        <div className="flex items-center gap-1.5 text-sm">
                                                            <span className="text-xs font-semibold text-muted-foreground">EN</span>
                                                            <span>{category.nameEn}</span>
                                                        </div>
                                                    )}
                                                    {category.namePl && (
                                                        <div className="flex items-center gap-1.5 text-sm">
                                                            <span className="text-xs font-semibold text-muted-foreground">PL</span>
                                                            <span>{category.namePl}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-6 h-6 rounded border"
                                                        style={{ backgroundColor: category.color || "#6366f1" }}
                                                    />
                                                    <span className="text-xs text-muted-foreground font-mono">
                                                        {category.color || "#6366f1"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleOpenEdit(category)}
                                                        disabled={isProcessing}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleOpenDelete(category.id)}
                                                        disabled={isProcessing}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingId ? "Edytuj kategorię" : "Dodaj kategorię"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingId ? "Zaktualizuj dane kategorii" : "Utwórz nową kategorię dla wpisów blogowych"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input
                                id="slug"
                                value={categorySlug}
                                onChange={(e) => setCategorySlug(e.target.value)}
                                placeholder="np. technologia"
                                disabled={isProcessing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nameEn">Nazwa (English) *</Label>
                            <Input
                                id="nameEn"
                                value={categoryNameEn}
                                onChange={(e) => setCategoryNameEn(e.target.value)}
                                placeholder="np. Technology"
                                disabled={isProcessing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="namePl">Nazwa (Polski) *</Label>
                            <Input
                                id="namePl"
                                value={categoryNamePl}
                                onChange={(e) => setCategoryNamePl(e.target.value)}
                                placeholder="np. Technologia"
                                disabled={isProcessing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="color">Kolor</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="color"
                                    type="color"
                                    value={categoryColor}
                                    onChange={(e) => setCategoryColor(e.target.value)}
                                    className="w-20 h-10"
                                    disabled={isProcessing}
                                />
                                <Input
                                    value={categoryColor}
                                    onChange={(e) => setCategoryColor(e.target.value)}
                                    placeholder="#3b82f6"
                                    disabled={isProcessing}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            disabled={isProcessing}
                        >
                            Anuluj
                        </Button>
                        <Button onClick={handleSave} disabled={isProcessing}>
                            {isProcessing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Zapisywanie...
                                </>
                            ) : (
                                editingId ? "Zapisz" : "Dodaj"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Czy na pewno chcesz usunąć tę kategorię?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Ta operacja jest nieodwracalna. Kategoria zostanie trwale usunięta z bazy danych.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>Anuluj</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isProcessing}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Usuwanie...
                                </>
                            ) : (
                                "Usuń"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
