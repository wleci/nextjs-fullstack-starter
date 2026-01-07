"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, User, LogOut, ChevronUp, Sun, Moon, Monitor, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTranslation, useLocale, supportedLocales } from "@/lib/i18n";

interface NavItem {
    href: string;
    icon: React.ElementType;
    labelKey: string;
}

const NAV_ITEMS: NavItem[] = [
    { href: "/dashboard", icon: Home, labelKey: "dashboard.nav.home" },
    { href: "/dashboard/profile", icon: User, labelKey: "dashboard.nav.profile" },
    { href: "/dashboard/settings", icon: Settings, labelKey: "dashboard.nav.settings" },
];

interface DashboardSidebarProps {
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
}

const LANGUAGE_FLAGS: Record<string, string> = {
    en: "🇬🇧",
    pl: "🇵🇱",
};

export function DashboardSidebar({ user }: DashboardSidebarProps) {
    const pathname = usePathname();
    const { t } = useTranslation();
    const { locale, setLocale } = useLocale();
    const { theme, setTheme } = useTheme();

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLanguageChange = (newLocale: string) => {
        setLocale(newLocale);
        const currentPath = window.location.pathname;
        const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
        window.location.href = `/${newLocale}${pathWithoutLocale}`;
    };

    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <Link href={`/${locale}`} className="text-xl font-bold">
                    Starter
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {NAV_ITEMS.map((item) => {
                                const isActive = pathname === `/${locale}${item.href}`;
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link href={`/${locale}${item.href}`}>
                                                <item.icon className="h-4 w-4" />
                                                <span>{t(item.labelKey)}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8">
                                        {user.avatar ? (
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                        ) : (
                                            <AvatarFallback className="text-xs">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className="flex flex-1 flex-col text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{user.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {user.email}
                                        </span>
                                    </div>
                                    <ChevronUp className="ml-auto h-4 w-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                                side="top"
                                align="start"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/${locale}/dashboard/profile`}>
                                            <User className="mr-2 h-4 w-4" />
                                            {t("dashboard.nav.profile")}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/${locale}/dashboard/settings`}>
                                            <Settings className="mr-2 h-4 w-4" />
                                            {t("dashboard.nav.settings")}
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Languages className="mr-2 h-4 w-4" />
                                            {LANGUAGE_FLAGS[locale]} Language
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                {supportedLocales.map((loc) => (
                                                    <DropdownMenuItem
                                                        key={loc}
                                                        onClick={() => handleLanguageChange(loc)}
                                                        className={locale === loc ? "bg-accent" : ""}
                                                    >
                                                        {LANGUAGE_FLAGS[loc]} {loc.toUpperCase()}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            {theme === "dark" ? (
                                                <Moon className="mr-2 h-4 w-4" />
                                            ) : theme === "light" ? (
                                                <Sun className="mr-2 h-4 w-4" />
                                            ) : (
                                                <Monitor className="mr-2 h-4 w-4" />
                                            )}
                                            {t(`common.${theme || "system"}`)}
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                                    <Sun className="mr-2 h-4 w-4" />
                                                    {t("common.light")}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                                    <Moon className="mr-2 h-4 w-4" />
                                                    {t("common.dark")}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                                    <Monitor className="mr-2 h-4 w-4" />
                                                    {t("common.system")}
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={`/${locale}/auth/logout`} className="text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
