"use client";

import { useState } from "react";
import { User, Mail, Camera, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/lib/i18n";
import { useSession, updateUser } from "@/lib/auth/client";

export default function ProfilePage() {
    const { t } = useTranslation();
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState(session?.user?.name ?? "");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsLoading(true);

        try {
            const response = await updateUser({ name });

            if (response.error) {
                setError(response.error.message ?? t("errors.serverError"));
                return;
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch {
            setError(t("errors.serverError"));
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">{t("dashboard.profile.title")}</h1>
                <p className="text-muted-foreground">{t("dashboard.profile.description")}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Avatar Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("dashboard.profile.avatar.title")}</CardTitle>
                            <CardDescription>{t("dashboard.profile.avatar.description")}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={session?.user?.image ?? undefined} />
                                    <AvatarFallback className="text-2xl">
                                        {getInitials(session?.user?.name ?? "U")}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                                    disabled
                                >
                                    <Camera className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-center">
                                <p className="font-medium">{session?.user?.name}</p>
                                <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Profile Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="md:col-span-2"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("dashboard.profile.info.title")}</CardTitle>
                            <CardDescription>{t("dashboard.profile.info.description")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                                    <Check className="h-4 w-4" />
                                    {t("dashboard.profile.success")}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t("dashboard.profile.form.name")}</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="pl-10"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">{t("dashboard.profile.form.email")}</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            value={session?.user?.email ?? ""}
                                            className="pl-10"
                                            disabled
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {t("dashboard.profile.form.emailHint")}
                                    </p>
                                </div>

                                <Separator />

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : null}
                                        {t("dashboard.profile.form.save")}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Account Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>{t("dashboard.profile.account.title")}</CardTitle>
                        <CardDescription>{t("dashboard.profile.account.description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    {t("dashboard.profile.account.id")}
                                </dt>
                                <dd className="mt-1 text-sm font-mono">{session?.user?.id}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    {t("dashboard.profile.account.createdAt")}
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {session?.user?.createdAt
                                        ? new Date(session.user.createdAt).toLocaleDateString()
                                        : "-"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    {t("dashboard.profile.account.emailVerified")}
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {session?.user?.emailVerified ? (
                                        <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                                            <Check className="h-4 w-4" />
                                            {t("dashboard.profile.account.verified")}
                                        </span>
                                    ) : (
                                        <span className="text-amber-600 dark:text-amber-400">
                                            {t("dashboard.profile.account.notVerified")}
                                        </span>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
