"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Users, Send, CheckCircle, AlertCircle } from "lucide-react";
import { testNewsletterEmail, getNewsletterStats } from "./actions";

export default function AdminNewsletterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [stats, setStats] = useState<{ total: number; active: number } | null>(null);

    const handleTestEmail = async (formData: FormData) => {
        setIsLoading(true);
        setError("");
        setSuccess(false);

        try {
            const result = await testNewsletterEmail(formData);
            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.error || "Failed to send newsletter");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const result = await getNewsletterStats();
            if (result.success && result.data) {
                setStats(result.data);
            }
        } catch (err) {
            console.error("Failed to load stats:", err);
        }
    };

    // Load stats on component mount
    useState(() => {
        loadStats();
    });

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Mail className="h-8 w-8" />
                    Newsletter Management
                </h1>
                <p className="text-muted-foreground mt-2">
                    Manage newsletter subscriptions and send test emails
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Send Test Newsletter</CardTitle>
                        <CardDescription>
                            Send a test newsletter to a specific email address
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleTestEmail} className="space-y-4">
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
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    placeholder="Newsletter Subject"
                                    defaultValue="Test Newsletter"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    name="content"
                                    placeholder="Newsletter content..."
                                    rows={6}
                                    defaultValue="This is a test newsletter email. Thank you for subscribing!"
                                    required
                                />
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="mr-2 h-4 w-4" />
                                )}
                                Send Test Newsletter
                            </Button>

                            {success && (
                                <div className="flex items-center gap-2 text-green-600 text-sm">
                                    <CheckCircle className="h-4 w-4" />
                                    Newsletter sent successfully!
                                </div>
                            )}

                            {error && (
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    Error: {error}
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Newsletter Statistics</CardTitle>
                        <CardDescription>
                            Overview of newsletter subscriptions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-500" />
                                <span className="font-medium">Total Subscribers</span>
                            </div>
                            <span className="text-2xl font-bold">
                                {stats ? stats.total : "..."}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="font-medium">Active Subscribers</span>
                            </div>
                            <span className="text-2xl font-bold">
                                {stats ? stats.active : "..."}
                            </span>
                        </div>

                        <Button onClick={loadStats} variant="outline" className="w-full">
                            Refresh Statistics
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Newsletter Features</CardTitle>
                    <CardDescription>
                        Available newsletter functionality
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2">Subscription Management</h3>
                            <p className="text-sm text-muted-foreground">
                                Users can subscribe/unsubscribe via API endpoints
                            </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2">Email Templates</h3>
                            <p className="text-sm text-muted-foreground">
                                Customizable HTML email templates with React Email
                            </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2">Unsubscribe Links</h3>
                            <p className="text-sm text-muted-foreground">
                                Automatic unsubscribe links in all newsletter emails
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
