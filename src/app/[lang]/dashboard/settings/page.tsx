"use client";

import { useState, useEffect } from "react";
import {
    Lock, Mail, Monitor, Smartphone,
    Loader2, Check, LogOut, Shield
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation, useLocale } from "@/lib/i18n";
import {
    useSession,
    changePassword,
    changeEmail,
    listSessions,
    revokeSession,
    revokeOtherSessions
} from "@/lib/auth/client";

interface Session {
    id: string;
    userAgent?: string | null;
    ipAddress?: string | null;
    createdAt: Date;
    expiresAt: Date;
}

export default function SettingsPage() {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const { data: session } = useSession();

    // Password change state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // Email change state
    const [newEmail, setNewEmail] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);

    // Sessions state
    const [sessions, setSessions] = useState<Session[]>([]);
    const [sessionsLoading, setSessionsLoading] = useState(true);
    const [revokingSession, setRevokingSession] = useState<string | null>(null);

    // Load sessions
    useEffect(() => {
        const loadSessions = async () => {
            try {
                const response = await listSessions();
                if (response.data) {
                    setSessions(response.data as Session[]);
                }
            } catch {
                // Ignore errors
            } finally {
                setSessionsLoading(false);
            }
        };
        loadSessions();
    }, []);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(false);

        if (newPassword !== confirmPassword) {
            setPasswordError(t("validation.confirmPassword.mismatch"));
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError(t("validation.password.min"));
            return;
        }

        setPasswordLoading(true);

        try {
            const response = await changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            });

            if (response.error) {
                setPasswordError(response.error.message ?? t("errors.serverError"));
                return;
            }

            setPasswordSuccess(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => setPasswordSuccess(false), 3000);
        } catch {
            setPasswordError(t("errors.serverError"));
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleEmailChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError(null);
        setEmailSuccess(false);

        if (!newEmail || !newEmail.includes("@")) {
            setEmailError(t("validation.email.invalid"));
            return;
        }

        setEmailLoading(true);

        try {
            const response = await changeEmail({ newEmail });

            if (response.error) {
                setEmailError(response.error.message ?? t("errors.serverError"));
                return;
            }

            setEmailSuccess(true);
            setNewEmail("");
        } catch {
            setEmailError(t("errors.serverError"));
        } finally {
            setEmailLoading(false);
        }
    };

    const handleRevokeSession = async (sessionId: string) => {
        setRevokingSession(sessionId);
        try {
            await revokeSession({ id: sessionId });
            setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        } catch {
            // Ignore errors
        } finally {
            setRevokingSession(null);
        }
    };

    const handleRevokeOtherSessions = async () => {
        setRevokingSession("all");
        try {
            await revokeOtherSessions();
            // Keep only current session
            const currentSessionId = session?.session?.id;
            setSessions((prev) => prev.filter((s) => s.id === currentSessionId));
        } catch {
            // Ignore errors
        } finally {
            setRevokingSession(null);
        }
    };

    const getDeviceIcon = (userAgent?: string | null) => {
        if (!userAgent) return <Monitor className="h-4 w-4" />;
        const ua = userAgent.toLowerCase();
        if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
            return <Smartphone className="h-4 w-4" />;
        }
        return <Monitor className="h-4 w-4" />;
    };

    const formatUserAgent = (userAgent?: string | null) => {
        if (!userAgent) return t("dashboard.settings.sessions.unknownDevice");
        // Simple parsing - extract browser name
        if (userAgent.includes("Firefox")) return "Firefox";
        if (userAgent.includes("Chrome")) return "Chrome";
        if (userAgent.includes("Safari")) return "Safari";
        if (userAgent.includes("Edge")) return "Edge";
        return t("dashboard.settings.sessions.unknownDevice");
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">{t("dashboard.settings.title")}</h1>
                <p className="text-muted-foreground">{t("dashboard.settings.description")}</p>
            </div>

            <div className="grid gap-6">
                {/* Change Password */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                {t("dashboard.settings.password.title")}
                            </CardTitle>
                            <CardDescription>
                                {t("dashboard.settings.password.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {passwordError && (
                                <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                    {passwordError}
                                </div>
                            )}
                            {passwordSuccess && (
                                <div className="mb-4 rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                                    <Check className="h-4 w-4" />
                                    {t("dashboard.settings.password.success")}
                                </div>
                            )}

                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">
                                        {t("dashboard.settings.password.current")}
                                    </Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        disabled={passwordLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">
                                        {t("dashboard.settings.password.new")}
                                    </Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={passwordLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">
                                        {t("dashboard.settings.password.confirm")}
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={passwordLoading}
                                    />
                                </div>
                                <Button type="submit" disabled={passwordLoading}>
                                    {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t("dashboard.settings.password.submit")}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Change Email */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                {t("dashboard.settings.email.title")}
                            </CardTitle>
                            <CardDescription>
                                {t("dashboard.settings.email.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 p-3 rounded-md bg-muted">
                                <p className="text-sm">
                                    <span className="text-muted-foreground">{t("dashboard.settings.email.current")}: </span>
                                    <span className="font-medium">{session?.user?.email}</span>
                                </p>
                            </div>

                            {emailError && (
                                <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                    {emailError}
                                </div>
                            )}
                            {emailSuccess && (
                                <div className="mb-4 rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                                    <Check className="h-4 w-4" />
                                    {t("dashboard.settings.email.success")}
                                </div>
                            )}

                            <form onSubmit={handleEmailChange} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="newEmail">
                                        {t("dashboard.settings.email.new")}
                                    </Label>
                                    <Input
                                        id="newEmail"
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        placeholder="new@example.com"
                                        disabled={emailLoading}
                                    />
                                </div>
                                <Button type="submit" disabled={emailLoading}>
                                    {emailLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t("dashboard.settings.email.submit")}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Active Sessions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        {t("dashboard.settings.sessions.title")}
                                    </CardTitle>
                                    <CardDescription>
                                        {t("dashboard.settings.sessions.description")}
                                    </CardDescription>
                                </div>
                                {sessions.length > 1 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRevokeOtherSessions}
                                        disabled={revokingSession === "all"}
                                    >
                                        {revokingSession === "all" ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <LogOut className="mr-2 h-4 w-4" />
                                        )}
                                        {t("dashboard.settings.sessions.revokeAll")}
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {sessionsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : sessions.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    {t("dashboard.settings.sessions.noSessions")}
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {sessions.map((s) => {
                                        const isCurrentSession = s.id === session?.session?.id;
                                        return (
                                            <div
                                                key={s.id}
                                                className="flex items-center justify-between p-3 rounded-lg border"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-full bg-muted">
                                                        {getDeviceIcon(s.userAgent)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium flex items-center gap-2">
                                                            {formatUserAgent(s.userAgent)}
                                                            {isCurrentSession && (
                                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                                                    {t("dashboard.settings.sessions.current")}
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {s.ipAddress ?? t("dashboard.settings.sessions.unknownIp")} • {new Date(s.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                {!isCurrentSession && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRevokeSession(s.id)}
                                                        disabled={revokingSession === s.id}
                                                    >
                                                        {revokingSession === s.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <LogOut className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
