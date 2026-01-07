"use client";

import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useTranslation, useLocale } from "@/lib/i18n";

const ROUTE_LABELS: Record<string, string> = {
    dashboard: "dashboard.nav.home",
    profile: "dashboard.nav.profile",
    settings: "dashboard.nav.settings",
};

export function DashboardHeader() {
    const pathname = usePathname();
    const { t } = useTranslation();
    const { locale } = useLocale();

    // Parse path segments (remove locale prefix)
    const segments = pathname
        .replace(`/${locale}`, "")
        .split("/")
        .filter(Boolean);

    // Get current page label
    const currentSegment = segments[segments.length - 1] || "dashboard";
    const currentLabel = ROUTE_LABELS[currentSegment]
        ? t(ROUTE_LABELS[currentSegment])
        : currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1);

    // Check if we're on dashboard root
    const isDashboardRoot = segments.length === 1 && segments[0] === "dashboard";

    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        {isDashboardRoot ? (
                            <BreadcrumbPage>Dashboard</BreadcrumbPage>
                        ) : (
                            <BreadcrumbLink href={`/${locale}/dashboard`}>Dashboard</BreadcrumbLink>
                        )}
                    </BreadcrumbItem>
                    {!isDashboardRoot && (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </>
                    )}
                </BreadcrumbList>
            </Breadcrumb>
        </header>
    );
}
