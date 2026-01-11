"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Users, Settings, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/lib/auth/client";
import { useTranslation, useLocale } from "@/lib/i18n";

export default function AdminPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const { locale } = useLocale();
    const { t } = useTranslation();

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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("admin.stats.users")}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-xs text-muted-foreground">{t("admin.stats.totalUsers")}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("admin.stats.sessions")}</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-xs text-muted-foreground">{t("admin.stats.activeSessions")}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("admin.stats.system")}</CardTitle>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">OK</div>
                        <p className="text-xs text-muted-foreground">{t("admin.stats.systemStatus")}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
