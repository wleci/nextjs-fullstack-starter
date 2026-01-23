import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AdminLayoutClient } from "@/components/layout/admin-layout-client";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const user = session?.user
        ? {
            name: session.user.name,
            email: session.user.email,
            avatar: session.user.image,
            role: session.user.role,
        }
        : {
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
        };

    return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}
