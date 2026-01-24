import { getMostViewedPosts } from "@/lib/blog/views";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, TrendingUp } from "lucide-react";
import Link from "next/link";

interface MostViewedPostsProps {
    locale: string;
    limit?: number;
}

export async function MostViewedPosts({ locale, limit = 5 }: MostViewedPostsProps) {
    const posts = await getMostViewedPosts(locale, limit);

    if (posts.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Most Viewed Posts
                </CardTitle>
                <CardDescription>
                    Top {limit} most popular blog posts
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {posts.map((post, index) => (
                    <Link
                        key={post.id}
                        href={`/${locale}/blog/${post.slug}`}
                        className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                {post.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <Eye className="h-3.5 w-3.5" />
                                <span>{post.views.toLocaleString(locale)} views</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}
