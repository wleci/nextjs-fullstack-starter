"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardLayout } from "@/components/layout";

// Mock user - w przyszłości pobierany z sesji
const mockUser = {
    name: "John Doe",
    email: "john@example.com",
};

export default function DashboardRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <DashboardLayout user={mockUser}>
                {children}
            </DashboardLayout>
        </SidebarProvider>
    );
}
