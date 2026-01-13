"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Users, Activity, TrendingUp, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession, authClient } from "@/lib/auth/client";
import { useTranslation, useLocale } from "@/lib/i18n";

export default function AdminPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const { locale } = useLocale();
    const { t } = useTranslation();
    const [stats, setStats] = useState({ totalUsers: 0, adminUsers: 0, bannedUsers: 0 });
    const [isLoadingStats, setIsLoadingStats] = useState(true);

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
        async function fetchStats() {
            if (userRole !== "admin") return;

            try {
                const response = await authClient.admin.listUsers({
                    query: { limit: 1000 }
                });

                if (response.data) {
                    const users = response.data.users;
                    setStats({
                        totalUsers: response.data.total ?? users.length,
                        adminUsers: users.filter((u) => u.role === "admin").length,
                        bannedUsers: users.filter((u) => u.banned === true).length,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setIsLoadingStats(false);
            }
        }

        if (userRole === "admin") {
            fetchStats();
        }
    }, [userRole]);

    if (isPending || !session || userRole !== "admin") {
        return null;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold">{t("admin.title")}</h1>
                    <p className="text-muted-foreground">{t("admin.description")}</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("admin.stats.users")}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoadingStats ? "..." : stats.totalUsers}
                        </div>
                        <p className="text-xs text-muted-foreground">{t("admin.stats.totalUsers")}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("admin.stats.admins")}</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoadingStats ? "..." : stats.adminUsers}
                        </div>
                        <p className="text-xs text-muted-foreground">{t("admin.stats.totalAdmins")}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("admin.stats.banned")}</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoadingStats ? "..." : stats.bannedUsers}
                        </div>
                        <p className="text-xs text-muted-foreground">{t("admin.stats.bannedUsers")}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("admin.stats.system")}</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">OK</div>
                        <p className="text-xs text-muted-foreground">{t("admin.stats.systemStatus")}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push(`/${locale}/admin/users`)}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            {t("admin.cards.users.title")}
                        </CardTitle>
                        <CardDescription>{t("admin.cards.users.description")}</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push(`/${locale}/admin/blog`)}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            {t("admin.blog.title")}
                        </CardTitle>
                        <CardDescription>{t("admin.blog.description")}</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push(`/${locale}/admin/email`)}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Test Email
                        </CardTitle>
                        <CardDescription>Wyślij testowe emaile i sprawdź konfigurację SMTP</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
