"use client";

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";

interface DashboardLayoutProps {
    children: React.ReactNode;
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen w-full">
            <DashboardSidebar user={user} />
            <div className="flex flex-1 flex-col">
                <DashboardHeader />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
