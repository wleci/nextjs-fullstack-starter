"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, Database, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import {
    exportDatabaseAsJson,
    getDatabaseStats,
    importDatabase,
    validateImportFile,
} from "@/lib/database/actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DatabaseManagementPage() {
    const [stats, setStats] = useState<Record<string, number> | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
    const [showClearDialog, setShowClearDialog] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importStats, setImportStats] = useState<Record<string, number> | null>(null);

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await getDatabaseStats();
            setStats(data);
        } catch (error) {
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Nie udało się pobrać statystyk",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            setLoading(true);
            setMessage(null);

            const jsonData = await exportDatabaseAsJson();
            const blob = new Blob([jsonData], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `database-export-${new Date().toISOString().split("T")[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setMessage({
                type: "success",
                text: "Baza danych została pomyślnie wyeksportowana",
            });
        } catch (error) {
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Nie udało się wyeksportować bazy danych",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImportFile(file);
        setMessage(null);
        setImportStats(null);

        try {
            setLoading(true);
            const text = await file.text();
            const validation = await validateImportFile(text);

            if (validation.valid) {
                setImportStats(validation.stats || null);
                setMessage({
                    type: "info",
                    text: validation.message,
                });
            } else {
                setMessage({
                    type: "error",
                    text: validation.message,
                });
                setImportFile(null);
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: "Nie udało się odczytać pliku",
            });
            setImportFile(null);
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (clearExisting: boolean) => {
        if (!importFile) return;

        try {
            setLoading(true);
            setMessage(null);

            const text = await importFile.text();
            const result = await importDatabase(text, clearExisting);

            if (result.success) {
                setMessage({
                    type: "success",
                    text: result.message,
                });
                setImportFile(null);
                setImportStats(null);
                await loadStats();
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Nie udało się zaimportować bazy danych",
            });
        } finally {
            setLoading(false);
            setShowClearDialog(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Zarządzanie bazą danych</h1>
                <p className="text-muted-foreground">
                    Eksportuj i importuj całą bazę danych w formacie JSON
                </p>
            </div>

            {message && (
                <div
                    className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${message.type === "success"
                        ? "bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100"
                        : message.type === "error"
                            ? "bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100"
                            : "bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100"
                        }`}
                >
                    {message.type === "success" && <CheckCircle2 className="w-5 h-5 mt-0.5" />}
                    {message.type === "error" && <AlertTriangle className="w-5 h-5 mt-0.5" />}
                    {message.type === "info" && <Info className="w-5 h-5 mt-0.5" />}
                    <p>{message.text}</p>
                </div>
            )}

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="w-5 h-5" />
                            Statystyki bazy danych
                        </CardTitle>
                        <CardDescription>
                            Aktualna liczba rekordów w poszczególnych tabelach
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!stats ? (
                            <Button onClick={loadStats} disabled={loading}>
                                {loading ? "Ładowanie..." : "Pokaż statystyki"}
                            </Button>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold">{stats.users}</div>
                                    <div className="text-sm text-muted-foreground">Użytkownicy</div>
                                </div>
                                <div className="p-4 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold">{stats.sessions}</div>
                                    <div className="text-sm text-muted-foreground">Sesje</div>
                                </div>
                                <div className="p-4 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold">{stats.accounts}</div>
                                    <div className="text-sm text-muted-foreground">Konta</div>
                                </div>
                                <div className="p-4 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold">{stats.blogPosts}</div>
                                    <div className="text-sm text-muted-foreground">Posty</div>
                                </div>
                                <div className="p-4 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold">{stats.blogCategories}</div>
                                    <div className="text-sm text-muted-foreground">Kategorie</div>
                                </div>
                                <div className="p-4 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold">{stats.verifications}</div>
                                    <div className="text-sm text-muted-foreground">Weryfikacje</div>
                                </div>
                                <div className="p-4 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold">{stats.twoFactors}</div>
                                    <div className="text-sm text-muted-foreground">2FA</div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="w-5 h-5" />
                            Eksport bazy danych
                        </CardTitle>
                        <CardDescription>
                            Pobierz całą bazę danych jako plik JSON
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleExport} disabled={loading}>
                            <Download className="w-4 h-4 mr-2" />
                            {loading ? "Eksportowanie..." : "Eksportuj bazę danych"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            Import bazy danych
                        </CardTitle>
                        <CardDescription>
                            Wczytaj bazę danych z pliku JSON
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleFileSelect}
                                disabled={loading}
                                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                            />
                        </div>

                        {importStats && (
                            <div className="p-4 bg-muted rounded-lg">
                                <h4 className="font-semibold mb-2">Zawartość pliku:</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>Użytkownicy: {importStats.users}</div>
                                    <div>Sesje: {importStats.sessions}</div>
                                    <div>Konta: {importStats.accounts}</div>
                                    <div>Posty: {importStats.blogPosts}</div>
                                    <div>Kategorie: {importStats.blogCategories}</div>
                                    <div>Weryfikacje: {importStats.verifications}</div>
                                    <div>2FA: {importStats.twoFactors}</div>
                                </div>
                            </div>
                        )}

                        {importFile && (
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleImport(false)}
                                    disabled={loading}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    {loading ? "Importowanie..." : "Importuj (dodaj do istniejących)"}
                                </Button>
                                <Button
                                    onClick={() => setShowClearDialog(true)}
                                    disabled={loading}
                                    variant="destructive"
                                >
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Importuj (wyczyść bazę)
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Czy na pewno chcesz wyczyścić bazę danych?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Ta operacja usunie wszystkie istniejące dane przed importem nowych.
                            Tej operacji nie można cofnąć. Upewnij się, że masz kopię zapasową.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Anuluj</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleImport(true)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Tak, wyczyść i importuj
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
