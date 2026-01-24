"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

interface AdminLayoutClientProps {
    user: {
        name: string;
        email: string;
        avatar?: string | null;
        role?: string;
    };
    children: React.ReactNode;
}

export function AdminLayoutClient({ user, children }: AdminLayoutClientProps) {
    // Convert null to undefined for avatar
    const userWithAvatar = {
        ...user,
        avatar: user.avatar || undefined,
    };

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AdminSidebar user={userWithAvatar} />
                <div className="flex flex-1 flex-col">
                    <DashboardHeader />
                    <main className="flex-1 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
