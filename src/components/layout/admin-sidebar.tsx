"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home, Users, Mail, FileText, Newspaper, ChevronUp, LogOut,
    Sun, Moon, Monitor, Languages, Crown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { GB, PL } from 'country-flag-icons/react/3x2';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal,
    DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent,
    DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
    SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu,
    SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { env } from "@/lib/env";
import { useLocale, useTranslation, supportedLocales } from "@/lib/i18n";
import { authClient } from "@/lib/auth/client";

interface NavItem {
    href: string;
    icon: React.ElementType;
    labelKey: string;
    enabled?: boolean;
}

const ADMIN_NAV: NavItem[] = [
    { href: "/admin", icon: Home, labelKey: "admin.dashboard.title" },
    { href: "/admin/users", icon: Users, labelKey: "admin.users.title" },
    { href: "/admin/email", icon: Mail, labelKey: "admin.email.title", enabled: env.NEXT_PUBLIC_ENABLE_EMAIL },
    { href: "/admin/newsletter", icon: Newspaper, labelKey: "admin.newsletter.title", enabled: env.NEXT_PUBLIC_ENABLE_NEWSLETTER },
    { href: "/admin/blog", icon: FileText, labelKey: "admin.blog.title", enabled: env.NEXT_PUBLIC_ENABLE_BLOG },
];

const FLAGS: Record<string, React.ComponentType<{ className?: string }>> = {
    en: GB,
    pl: PL,
};

const LANGUAGE_NAMES: Record<string, string> = { 
    en: "English", 
    pl: "Polski" 
};

interface AdminSidebarProps {
    user: { name: string; email: string; avatar?: string; role?: string };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
    const pathname = usePathname();
    const { locale, setLocale } = useLocale();
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const handleLanguageChange = (newLocale: string) => {
        setLocale(newLocale);
        const path = window.location.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
        window.location.href = `/${newLocale}${path}`;
    };

    const handleLogout = () => {
        authClient.signOut();
    };

    const isActive = (href: string) => {
        const fullPath = `/${locale}${href}`;
        return pathname === fullPath || pathname.startsWith(fullPath + "/");
    };

    const enabledItems = ADMIN_NAV.filter(item => item.enabled !== false);
    const isAdmin = user.role === "admin";

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={`/${locale}/admin`}>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Users className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Admin Panel</span>
                                    <span className="text-xs text-muted-foreground">Management</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Administration</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {enabledItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                                        <Link href={`/${locale}${item.href}`}>
                                            <item.icon />
                                            <span>{t(item.labelKey)}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : (
                                            <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate font-medium">{user.name}</span>
                                            {isAdmin && (
                                                <Badge variant="default" className="h-5 px-1.5 text-[10px] font-semibold">
                                                    <Crown className="mr-0.5 h-3 w-3" />
                                                    Admin
                                                </Badge>
                                            )}
                                        </div>
                                        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                    <ChevronUp className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56" side="top" align="end" sideOffset={4}>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">{user.name}</p>
                                        {isAdmin && (
                                            <Badge variant="default" className="h-5 px-1.5 text-[10px] font-semibold">
                                                <Crown className="mr-0.5 h-3 w-3" />
                                                Admin
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Languages className="mr-2 h-4 w-4" />
                                            {(() => {
                                                const Flag = FLAGS[locale];
                                                return Flag ? <Flag className="mr-2 h-4 w-5 rounded-sm border border-border/50" /> : null;
                                            })()}
                                            {LANGUAGE_NAMES[locale]}
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                {supportedLocales.map((loc) => {
                                                    const Flag = FLAGS[loc];
                                                    return (
                                                        <DropdownMenuItem key={loc} onClick={() => handleLanguageChange(loc)} className={locale === loc ? "bg-accent" : ""}>
                                                            {Flag && <Flag className="mr-2 h-4 w-6 rounded-sm border border-border/50" />}
                                                            {LANGUAGE_NAMES[loc]}
                                                        </DropdownMenuItem>
                                                    );
                                                })}
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            {theme === "dark" ? <Moon /> : theme === "light" ? <Sun /> : <Monitor />}
                                            {t(`common.${theme || "system"}`)}
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem onClick={() => setTheme("light")}><Sun /> {t("common.light")}</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setTheme("dark")}><Moon /> {t("common.dark")}</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setTheme("system")}><Monitor /> {t("common.system")}</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <LogOut />
                                    {t("auth.logout.action")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
