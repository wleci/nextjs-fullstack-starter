"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Mail, Send, Users, Loader2, CheckCircle, AlertCircle,
    Eye, Sparkles
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "@/lib/auth/client";
import { useLocale } from "@/lib/i18n";
import {
    getNewsletterStats,
    sendNewsletter,
    sendTestNewsletter
} from "@/lib/newsletter/actions";

export default function AdminNewsletterPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const { locale } = useLocale();

    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [subscriberCount, setSubscriberCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [isSendingTest, setIsSendingTest] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        message: string;
        details?: string;
    } | null>(null);

    const userRole = session?.user?.role;

    useEffect(() => {
        if (!isPending) {
            if (!session) {
                router.replace(`/${locale}/auth/login`);
            } else if (userRole !== "admin") {
                router.replace(`/${locale}/dashboard`);
            }
        }
    }, [isPending, session, userRole, router, locale]);

    useEffect(() => {
        async function loadStats() {
            if (userRole !== "admin") return;
            try {
                const stats = await getNewsletterStats();
                setSubscriberCount(stats.subscriberCount);
            } catch (error) {
                console.error("Failed to load stats:", error);
            } finally {
                setIsLoading(false);
            }
        }
        if (userRole === "admin") {
            loadStats();
        }
    }, [userRole]);

    const handleSendTest = async () => {
        if (!subject.trim() || !content.trim()) {
            setResult({ success: false, message: "Wypełnij temat i treść" });
            return;
        }

        setIsSendingTest(true);
        setResult(null);

        const response = await sendTestNewsletter(subject, content);

        if (response.success) {
            setResult({
                success: true,
                message: `Testowy email wysłany na ${session?.user.email}`
            });
        } else {
            setResult({ success: false, message: response.error || "Błąd wysyłania" });
        }

        setIsSendingTest(false);
    };

    const handleSend = async () => {
        setConfirmDialogOpen(false);
        setIsSending(true);
        setResult(null);

        const response = await sendNewsletter(subject, content);

        if (response.success) {
            setResult({
                success: true,
                message: `Newsletter wysłany!`,
                details: `Wysłano: ${response.sent}, Błędy: ${response.failed}`
            });
            setSubject("");
            setContent("");
        } else {
            setResult({ success: false, message: response.error || "Błąd wysyłania" });
        }

        setIsSending(false);
    };

    if (isPending || !session || userRole !== "admin") {
        return null;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Mail className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold">Newsletter</h1>
                        <p className="text-muted-foreground">Wyślij newsletter do subskrybentów</p>
                    </div>
                </div>
                <Badge variant="secondary" className="text-sm gap-1">
                    <Users className="h-4 w-4" />
                    {isLoading ? "..." : subscriberCount} subskrybentów
                </Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Nowy newsletter</CardTitle>
                            <CardDescription>
                                Stwórz i wyślij newsletter do wszystkich subskrybentów
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Temat</Label>
                                <Input
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Temat newslettera..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Treść</Label>
                                <Textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Treść newslettera... (możesz używać HTML)"
                                    rows={12}
                                    className="font-mono text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Możesz używać podstawowego HTML: &lt;b&gt;, &lt;i&gt;, &lt;a href=&quot;...&quot;&gt;, &lt;br&gt;
                                </p>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={handleSendTest}
                                    disabled={isSendingTest || isSending || !subject.trim() || !content.trim()}
                                >
                                    {isSendingTest ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Eye className="mr-2 h-4 w-4" />
                                    )}
                                    Wyślij test
                                </Button>
                                <Button
                                    onClick={() => setConfirmDialogOpen(true)}
                                    disabled={isSending || isSendingTest || !subject.trim() || !content.trim() || subscriberCount === 0}
                                >
                                    {isSending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="mr-2 h-4 w-4" />
                                    )}
                                    Wyślij do wszystkich ({subscriberCount})
                                </Button>
                            </div>

                            {result && (
                                <div className={`flex items-start gap-2 p-4 rounded-lg ${result.success
                                        ? "bg-green-500/10 text-green-600"
                                        : "bg-red-500/10 text-red-600"
                                    }`}>
                                    {result.success ? (
                                        <CheckCircle className="h-5 w-5 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 mt-0.5" />
                                    )}
                                    <div>
                                        <p className="font-medium">{result.message}</p>
                                        {result.details && (
                                            <p className="text-sm opacity-80">{result.details}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                Wskazówki
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground">
                            <div>
                                <p className="font-medium text-foreground mb-1">Testuj przed wysłaniem</p>
                                <p>Zawsze wyślij najpierw test do siebie, żeby sprawdzić jak wygląda email.</p>
                            </div>
                            <div>
                                <p className="font-medium text-foreground mb-1">Link wypisania</p>
                                <p>Każdy email zawiera unikalny link do wypisania się z newslettera.</p>
                            </div>
                            <div>
                                <p className="font-medium text-foreground mb-1">Formatowanie</p>
                                <p>Używaj prostego HTML lub zwykłego tekstu. Nowe linie są automatycznie konwertowane.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Statystyki</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-4">
                                <div className="text-4xl font-bold text-primary">
                                    {isLoading ? "..." : subscriberCount}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    aktywnych subskrybentów
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Confirm Dialog */}
            <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Potwierdź wysyłkę</DialogTitle>
                        <DialogDescription>
                            Czy na pewno chcesz wysłać newsletter do {subscriberCount} subskrybentów?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm"><strong>Temat:</strong> {subject}</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                            Anuluj
                        </Button>
                        <Button onClick={handleSend}>
                            <Send className="mr-2 h-4 w-4" />
                            Wyślij newsletter
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
