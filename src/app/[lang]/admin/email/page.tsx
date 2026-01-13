"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth/client";
import { useLocale } from "@/lib/i18n";
import { sendTestEmail, type EmailTemplate } from "@/lib/email/actions";

const templates: { id: EmailTemplate; name: string; description: string }[] = [
    { id: "welcome", name: "Powitanie", description: "Email powitalny dla nowych użytkowników" },
    { id: "verify", name: "Weryfikacja email", description: "Link do weryfikacji adresu email" },
    { id: "reset", name: "Reset hasła", description: "Link do resetowania hasła" },
    { id: "2fa", name: "Kod 2FA", description: "Kod weryfikacyjny dwuskładnikowy" },
    { id: "login", name: "Powiadomienie o logowaniu", description: "Informacja o nowym logowaniu" },
];

export default function AdminEmailPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const { locale } = useLocale();

    const [email, setEmail] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>("welcome");
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const userRole = session?.user?.role;

    useEffect(() => {
        if (!isPending) {
            if (!session) {
                router.replace(`/${locale}/auth/login`);
            } else if (userRole !== "admin") {
                router.replace(`/${locale}/dashboard`);
            } else {
                setEmail(session.user.email);
            }
        }
    }, [isPending, session, userRole, router, locale]);

    const handleSend = async () => {
        if (!email || sending) return;

        setSending(true);
        setResult(null);

        const response = await sendTestEmail({ to: email, template: selectedTemplate });

        if (response.success) {
            setResult({ success: true, message: `Email testowy wysłany na ${email}` });
        } else {
            setResult({ success: false, message: response.error || "Błąd wysyłania" });
        }

        setSending(false);
    };

    if (isPending || !session || userRole !== "admin") {
        return null;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Mail className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold">Test Email</h1>
                    <p className="text-muted-foreground">Wyślij testowe emaile, aby sprawdzić konfigurację SMTP</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Wyślij testowy email</CardTitle>
                        <CardDescription>Wybierz szablon i adres email do testu</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Adres email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="test@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Szablon</Label>
                            <div className="grid gap-2">
                                {templates.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template.id)}
                                        className={`text-left p-3 rounded-lg border transition-all ${selectedTemplate === template.id
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                            }`}
                                    >
                                        <div className="font-medium">{template.name}</div>
                                        <div className="text-sm text-muted-foreground">{template.description}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={handleSend}
                            disabled={!email || sending}
                            className="w-full"
                        >
                            {sending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Wysyłanie...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Wyślij testowy email
                                </>
                            )}
                        </Button>

                        {result && (
                            <div className={`flex items-center gap-2 p-3 rounded-lg ${result.success
                                    ? "bg-green-500/10 text-green-600"
                                    : "bg-red-500/10 text-red-600"
                                }`}>
                                {result.success ? (
                                    <CheckCircle className="h-5 w-5" />
                                ) : (
                                    <AlertCircle className="h-5 w-5" />
                                )}
                                <span className="text-sm">{result.message}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Informacje o konfiguracji</CardTitle>
                        <CardDescription>Aktualne ustawienia SMTP</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-border">
                                <span className="text-muted-foreground">Status</span>
                                <span className="text-green-600 font-medium">Skonfigurowany</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border">
                                <span className="text-muted-foreground">Dostępne szablony</span>
                                <span className="font-medium">{templates.length}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Biblioteka</span>
                                <span className="font-medium">Nodemailer</span>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium mb-2">Wskazówki</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Sprawdź folder spam jeśli email nie dotarł</li>
                                <li>• Upewnij się, że zmienne SMTP są poprawne w .env</li>
                                <li>• Testowe emaile mają prefix [TEST] w temacie</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
