"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardLayout } from "@/components/layout";
import { useSession } from "@/lib/auth/client";
import { useLocale } from "@/lib/i18n";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const { locale } = useLocale();

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

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!session || userRole !== "admin") {
        return null;
    }

    const user = {
        name: session.user.name ?? "User",
        email: session.user.email,
        avatar: session.user.image ?? undefined,
        role: userRole,
    };

    return (
        <SidebarProvider>
            <DashboardLayout user={user}>
                {children}
            </DashboardLayout>
        </SidebarProvider>
    );
}
