import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/layout";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

// Mock admin user - w przyszłości pobierany z sesji
const mockAdminUser = {
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AdminSidebar user={mockAdminUser} />
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
