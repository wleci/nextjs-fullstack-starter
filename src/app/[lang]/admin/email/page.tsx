"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mail, Send, CheckCircle } from "lucide-react";
import { sendTestEmail } from "./actions";

const EMAIL_TEMPLATES = [
    { value: "verify-email", label: "Email Verification" },
    { value: "reset-password", label: "Password Reset" },
    { value: "two-factor", label: "Two Factor Code" },
    { value: "welcome", label: "Welcome Email" },
];

export default function AdminEmailPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        setError("");
        setSuccess(false);

        try {
            const result = await sendTestEmail(formData);
            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.error || "Failed to send email");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Mail className="h-8 w-8" />
                    Email Testing
                </h1>
                <p className="text-muted-foreground mt-2">
                    Test email templates and SMTP configuration
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Send Test Email</CardTitle>
                        <CardDescription>
                            Send a test email using one of the available templates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="to">Recipient Email</Label>
                                <Input
                                    id="to"
                                    name="to"
                                    type="email"
                                    placeholder="test@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="template">Email Template</Label>
                                <Select name="template" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {EMAIL_TEMPLATES.map((template) => (
                                            <SelectItem key={template.value} value={template.value}>
                                                {template.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="subject">Subject (optional)</Label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    placeholder="Custom subject line"
                                />
                            </div>

                            <div>
                                <Label htmlFor="userName">User Name</Label>
                                <Input
                                    id="userName"
                                    name="userName"
                                    placeholder="John Doe"
                                    defaultValue="Test User"
                                />
                            </div>

                            <div>
                                <Label htmlFor="customData">Custom Data (JSON)</Label>
                                <Textarea
                                    id="customData"
                                    name="customData"
                                    placeholder='{"verificationUrl": "https://example.com/verify"}'
                                    rows={3}
                                />
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="mr-2 h-4 w-4" />
                                )}
                                Send Test Email
                            </Button>

                            {success && (
                                <div className="flex items-center gap-2 text-green-600 text-sm">
                                    <CheckCircle className="h-4 w-4" />
                                    Email sent successfully!
                                </div>
                            )}

                            {error && (
                                <div className="text-red-600 text-sm">
                                    Error: {error}
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>SMTP Configuration</CardTitle>
                        <CardDescription>
                            Current email configuration status
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">SMTP Host:</span>
                            <span className="text-sm font-mono">{process.env.NEXT_PUBLIC_SMTP_HOST || "Not configured"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">SMTP Port:</span>
                            <span className="text-sm font-mono">{process.env.NEXT_PUBLIC_SMTP_PORT || "587"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">From Address:</span>
                            <span className="text-sm font-mono">{process.env.NEXT_PUBLIC_SMTP_FROM || "Not configured"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Authentication:</span>
                            <span className="text-sm">
                                {process.env.NEXT_PUBLIC_SMTP_USER ? "✅ Configured" : "❌ Not configured"}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
