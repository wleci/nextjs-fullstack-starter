"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home, Settings, User, LogOut, ChevronUp, ChevronRight,
    Sun, Moon, Monitor, Languages, Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal,
    DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent,
    DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
    SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu,
    SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem,
    SidebarMenuSubButton, SidebarSeparator,
} from "@/components/ui/sidebar";
import { useTranslation, useLocale, supportedLocales } from "@/lib/i18n";

const MAIN_NAV = [
    { href: "/dashboard", icon: Home, labelKey: "dashboard.nav.home" },
];

const ACCOUNT_NAV = [
    { href: "/dashboard/profile", icon: User, labelKey: "dashboard.nav.profile" },
    { href: "/dashboard/settings", icon: Settings, labelKey: "dashboard.nav.settings" },
];

const LANGUAGE_FLAGS: Record<string, string> = { en: "🇬🇧", pl: "🇵🇱" };

interface DashboardSidebarProps {
    user: { name: string; email: string; avatar?: string };
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
    const pathname = usePathname();
    const { t } = useTranslation();
    const { locale, setLocale } = useLocale();
    const { theme, setTheme } = useTheme();

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const handleLanguageChange = (newLocale: string) => {
        setLocale(newLocale);
        const path = window.location.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
        window.location.href = `/${newLocale}${path}`;
    };

    const isActive = (href: string) => pathname === `/${locale}${href}`;
    const isAccountActive = ACCOUNT_NAV.some((item) => isActive(item.href));

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={`/${locale}`}>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Sparkles className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Starter</span>
                                    <span className="text-xs text-muted-foreground">v1.0.0</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {MAIN_NAV.map((item) => (
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

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <Collapsible defaultOpen={isAccountActive} className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            <User />
                                            <span>{t("dashboard.nav.account")}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {ACCOUNT_NAV.map((item) => (
                                                <SidebarMenuSubItem key={item.href}>
                                                    <SidebarMenuSubButton asChild isActive={isActive(item.href)}>
                                                        <Link href={`/${locale}${item.href}`}>
                                                            <item.icon className="size-4" />
                                                            <span>{t(item.labelKey)}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
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
                                        <span className="truncate font-medium">{user.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                    <ChevronUp className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56" side="top" align="end" sideOffset={4}>
                                <DropdownMenuLabel className="font-normal">
                                    <p className="text-sm font-medium">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Languages /> {LANGUAGE_FLAGS[locale]} Language
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                {supportedLocales.map((loc) => (
                                                    <DropdownMenuItem key={loc} onClick={() => handleLanguageChange(loc)} className={locale === loc ? "bg-accent" : ""}>
                                                        {LANGUAGE_FLAGS[loc]} {loc.toUpperCase()}
                                                    </DropdownMenuItem>
                                                ))}
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
                                <DropdownMenuItem asChild>
                                    <Link href={`/${locale}/auth/logout`} className="text-destructive"><LogOut /> Log out</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
