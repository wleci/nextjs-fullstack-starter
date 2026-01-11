import { BlogNavbar } from "./blog-navbar";
import { Footer } from "@/components/layout";

interface LayoutProps {
    children: React.ReactNode;
}

export default function BlogLayout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <BlogNavbar />
            <main className="flex-1 pt-16">
                {children}
            </main>
            <Footer />
        </div>
    );
}
