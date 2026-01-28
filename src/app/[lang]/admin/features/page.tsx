"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { getAllFeatures, toggleFeature } from "@/lib/features/actions";
import { FEATURE_KEYS } from "@/lib/features/constants";
import type { FeatureFlag } from "@/lib/features/schema";

const FEATURE_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
    [FEATURE_KEYS.REGISTRATION]: {
        title: "Rejestracja użytkowników",
        description: "Pozwala nowym użytkownikom na tworzenie kont w systemie",
    },
    [FEATURE_KEYS.PASSWORD_RESET]: {
        title: "Reset hasła",
        description: "Umożliwia użytkownikom resetowanie hasła przez email",
    },
    [FEATURE_KEYS.SOCIAL_LOGIN]: {
        title: "Logowanie społecznościowe",
        description: "Logowanie przez Google, Discord i inne platformy",
    },
};

export default function FeaturesPage() {
    const [features, setFeatures] = useState<FeatureFlag[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const loadFeatures = async () => {
        try {
            setLoading(true);
            const data = await getAllFeatures();
            setFeatures(data);
        } catch (error) {
            setMessage({
                type: "error",
                text: "Nie udało się załadować funkcji",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFeatures();
    }, []);

    const handleToggle = async (key: string, enabled: boolean) => {
        try {
            setUpdating(key);
            setMessage(null);

            const result = await toggleFeature(key as any, enabled);

            if (result.success) {
                setMessage({
                    type: "success",
                    text: result.message,
                });
                await loadFeatures();
            } else {
                setMessage({
                    type: "error",
                    text: result.message,
                });
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: "Nie udało się zaktualizować funkcji",
            });
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Zarządzanie funkcjami</h1>
                <p className="text-muted-foreground">
                    Włączaj lub wyłączaj funkcje systemu w czasie rzeczywistym
                </p>
            </div>

            {message && (
                <div
                    className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${message.type === "success"
                        ? "bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100"
                        : "bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100"
                        }`}
                >
                    {message.type === "success" ? (
                        <CheckCircle2 className="w-5 h-5 mt-0.5" />
                    ) : (
                        <XCircle className="w-5 h-5 mt-0.5" />
                    )}
                    <p>{message.text}</p>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Dostępne funkcje
                    </CardTitle>
                    <CardDescription>
                        Zmiany są natychmiastowe i wpływają na wszystkich użytkowników
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                    ) : features.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Brak dostępnych funkcji
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {features.map((feature) => {
                                const info = FEATURE_DESCRIPTIONS[feature.key] || {
                                    title: feature.key,
                                    description: feature.description || "",
                                };

                                return (
                                    <div
                                        key={feature.id}
                                        className="flex items-start justify-between p-4 border rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <Label
                                                htmlFor={feature.key}
                                                className="text-base font-semibold cursor-pointer"
                                            >
                                                {info.title}
                                            </Label>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {info.description}
                                            </p>
                                            {feature.updatedAt && (
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    Ostatnia zmiana:{" "}
                                                    {new Date(feature.updatedAt).toLocaleString("pl-PL")}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 ml-4">
                                            {updating === feature.key && (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            )}
                                            <Switch
                                                id={feature.key}
                                                checked={feature.enabled}
                                                onCheckedChange={(checked) =>
                                                    handleToggle(feature.key, checked)
                                                }
                                                disabled={updating === feature.key}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Informacje</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>
                        • Zmiany są natychmiastowe i nie wymagają restartu aplikacji
                    </p>
                    <p>
                        • Wyłączenie rejestracji ukryje formularz rejestracji dla nowych użytkowników
                    </p>
                    <p>
                        • Istniejące sesje użytkowników nie są przerywane przy wyłączaniu funkcji
                    </p>
                    <p>
                        • Wszystkie zmiany są logowane z informacją kto i kiedy je wykonał
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
