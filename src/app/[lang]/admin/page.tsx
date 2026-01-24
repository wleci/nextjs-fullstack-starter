import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Mail, FileText, Shield, Activity, Database, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { env } from "@/lib/env";
import { MostViewedPosts } from "@/components/blog/most-viewed-posts";

export default async function AdminDashboard() {
    const features = [
        { name: "Email System", enabled: env.NEXT_PUBLIC_ENABLE_EMAIL, icon: Mail, description: "Email templates and notifications" },
        { name: "Newsletter", enabled: env.NEXT_PUBLIC_ENABLE_NEWSLETTER, icon: FileText, description: "Newsletter management" },
        { name: "Blog", enabled: env.NEXT_PUBLIC_ENABLE_BLOG, icon: FileText, description: "Blog posts and content" },
    ];

    const stats = [
        { title: "Total Users", value: "0", description: "Registered users", icon: Users, color: "text-blue-600" },
        { title: "System Status", value: "Online", description: "All systems operational", icon: Activity, color: "text-green-600" },
        { title: "Database", value: "SQLite", description: "Connected and ready", icon: Database, color: "text-purple-600" },
        { title: "Performance", value: "Optimal", description: "Response time < 100ms", icon: Zap, color: "text-yellow-600" },
    ];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Monitor and manage your application
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Feature Status
                        </CardTitle>
                        <CardDescription>
                            Current status of application features
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {features.map((feature) => (
                            <div key={feature.name} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <feature.icon className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{feature.name}</p>
                                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                                    </div>
                                </div>
                                <Badge variant={feature.enabled ? "default" : "secondary"}>
                                    {feature.enabled ? "Enabled" : "Disabled"}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Quick Actions
                        </CardTitle>
                        <CardDescription>
                            Common administrative tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid gap-2">
                            <button className="flex items-center gap-2 p-3 text-left border rounded-lg hover:bg-muted/50 transition-colors">
                                <Users className="h-4 w-4" />
                                <div>
                                    <p className="font-medium">Manage Users</p>
                                    <p className="text-sm text-muted-foreground">View and edit user accounts</p>
                                </div>
                            </button>
                            {env.NEXT_PUBLIC_ENABLE_EMAIL && (
                                <button className="flex items-center gap-2 p-3 text-left border rounded-lg hover:bg-muted/50 transition-colors">
                                    <Mail className="h-4 w-4" />
                                    <div>
                                        <p className="font-medium">Test Email</p>
                                        <p className="text-sm text-muted-foreground">Send test emails</p>
                                    </div>
                                </button>
                            )}
                            {env.NEXT_PUBLIC_ENABLE_BLOG && (
                                <button className="flex items-center gap-2 p-3 text-left border rounded-lg hover:bg-muted/50 transition-colors">
                                    <FileText className="h-4 w-4" />
                                    <div>
                                        <p className="font-medium">Manage Blog</p>
                                        <p className="text-sm text-muted-foreground">Create and edit posts</p>
                                    </div>
                                </button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Most Viewed Posts */}
            {env.NEXT_PUBLIC_ENABLE_BLOG && (
                <MostViewedPosts locale="en" limit={5} />
            )}
        </div>
    );
}
