"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Settings, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "@/lib/auth/client";
import { useTranslation, useLocale } from "@/lib/i18n";
import type { BlogSettings } from "@/lib/blog";
import {
    getAdminBlogSettings,
    updateBlogSettings,
} from "@/lib/blog/actions";
import Link from "next/link";

export default function AdminBlogSettingsPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const { locale } = useLocale();
    const { t } = useTranslation();

    const [settings, setSettings] = useState<BlogSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [blogEnabled, setBlogEnabled] = useState(true);
    const [postsPerPage, setPostsPerPage] = useState(12);
    const [showFeatured, setShowFeatured] = useState(true);

    const userRole = session?.user?.role;

    const fetchSettings = useCallback(async () => {
        if (userRole !== "admin") return;

        setIsLoading(true);
        try {
            const settingsData = await getAdminBlogSettings();
            setSettings(settingsData);
            setBlogEnabled(settingsData.enabled ?? true);
            setPostsPerPage(settingsData.postsPerPage ?? 12);
            setShowFeatured(settingsData.showFeatured ?? true);
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userRole]);

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
            fetchSettings();
        }
    }, [userRole, fetchSettings]);

    const handleSaveSettings = async () => {
        setIsProcessing(true);
        setSaveSuccess(false);
        try {
            await updateBlogSettings({
                enabled: blogEnabled,
                postsPerPage,
                showFeatured,
            });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to save settings:", error);
            alert("Nie udało się zapisać ustawień");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isPending || !session || userRole !== "admin") {
        return null;
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Link href={`/${locale}/admin/blog`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <Settings className="h-8 w-8 text-primary shrink-0" />
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">Ustawienia bloga</h1>
                    <p className="text-sm text-muted-foreground">Konfiguruj wyświetlanie bloga</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Ogólne ustawienia</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="blogEnabled"
                                checked={blogEnabled}
                                onCheckedChange={(checked) => setBlogEnabled(checked === true)}
                            />
                            <Label htmlFor="blogEnabled" className="cursor-pointer">
                                Włącz blog
                            </Label>
                        </div>
                        <p className="text-sm text-muted-foreground -mt-4 ml-6">
                            Gdy wyłączone, blog nie będzie dostępny dla użytkowników
                        </p>

                        <div className="space-y-2">
                            <Label htmlFor="postsPerPage">Liczba wpisów na stronę</Label>
                            <Input
                                id="postsPerPage"
                                type="number"
                                min="1"
                                max="100"
                                value={postsPerPage}
                                onChange={(e) => setPostsPerPage(parseInt(e.target.value, 10) || 12)}
                                className="max-w-[120px]"
                            />
                            <p className="text-sm text-muted-foreground">
                                Domyślnie: 12 wpisów
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="showFeatured"
                                checked={showFeatured}
                                onCheckedChange={(checked) => setShowFeatured(checked === true)}
                            />
                            <Label htmlFor="showFeatured" className="cursor-pointer">
                                Wyświetlaj wyróżnione wpisy
                            </Label>
                        </div>
                        <p className="text-sm text-muted-foreground -mt-4 ml-6">
                            Wyróżnione wpisy będą pokazywane na górze listy
                        </p>

                        <div className="flex items-center gap-3 pt-4">
                            <Button onClick={handleSaveSettings} disabled={isProcessing}>
                                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Zapisz ustawienia
                            </Button>
                            {saveSuccess && (
                                <span className="text-sm text-green-600">
                                    ✓ Zapisano pomyślnie
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
