"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Users, Search, MoreHorizontal, Shield, Ban, UserCheck,
    ChevronLeft, ChevronRight, Loader2, Crown, Mail, Pencil,
    Trash2, CheckCircle, XCircle, Calendar, KeyRound, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useSession, authClient } from "@/lib/auth/client";
import { useTranslation, useLocale } from "@/lib/i18n";
import { updateUserAdmin, adminSendResetPassword, adminSendVerificationEmail, adminSetUserPassword } from "@/lib/auth/admin-actions";

interface User {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: string;
    banned?: boolean;
    banReason?: string | null;
    banExpires?: number | null;
    emailVerified?: boolean;
    createdAt?: string;
}

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const { locale } = useLocale();
    const { t } = useTranslation();

    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Ban dialog state
    const [banDialogOpen, setBanDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [banReason, setBanReason] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // Role dialog state
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [newRole, setNewRole] = useState<"user" | "admin">("user");

    // Edit dialog state
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Password dialog state
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");

    // Action result toast
    const [actionResult, setActionResult] = useState<{ success: boolean; message: string } | null>(null);

    const userRole = session?.user?.role;

    const fetchUsers = useCallback(async () => {
        if (userRole !== "admin") return;

        setIsLoading(true);
        try {
            const response = await authClient.admin.listUsers({
                query: {
                    limit: PAGE_SIZE,
                    offset: (page - 1) * PAGE_SIZE,
                    ...(search && {
                        searchValue: search,
                        searchField: "email" as const,
                        searchOperator: "contains" as const,
                    }),
                    sortBy: "createdAt",
                    sortDirection: "desc" as const,
                },
            });

            if (response.data) {
                setUsers(response.data.users as User[]);
                setTotal(response.data.total ?? 0);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userRole, page, search]);

    useEffect(() => {
        if (!isPending) {
            if (!session) {
                router.replace("/" + locale + "/auth/login");
            } else if (userRole !== "admin") {
                router.replace("/" + locale + "/dashboard");
            }
        }
    }, [isPending, session, userRole, router, locale]);

    useEffect(() => {
        if (userRole === "admin") {
            fetchUsers();
        }
    }, [userRole, fetchUsers]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const openBanDialog = (user: User) => {
        setSelectedUser(user);
        setBanReason("");
        setBanDialogOpen(true);
    };

    const openRoleDialog = (user: User) => {
        setSelectedUser(user);
        setNewRole((user.role as "user" | "admin") ?? "user");
        setRoleDialogOpen(true);
    };

    const openEditDialog = (user: User) => {
        setSelectedUser(user);
        setEditName(user.name);
        setEditEmail(user.email);
        setEditDialogOpen(true);
    };

    const openDeleteDialog = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const openPasswordDialog = (user: User) => {
        setSelectedUser(user);
        setNewPassword("");
        setPasswordDialogOpen(true);
    };

    const showResult = (success: boolean, message: string) => {
        setActionResult({ success, message });
        setTimeout(() => setActionResult(null), 3000);
    };

    const handleSendResetPassword = async (user: User) => {
        setIsProcessing(true);
        const result = await adminSendResetPassword(user.id);
        if (result.success) {
            showResult(true, `Email resetowania hasła wysłany do ${user.email}`);
        } else {
            showResult(false, result.error || "Błąd wysyłania");
        }
        setIsProcessing(false);
    };

    const handleSendVerificationEmail = async (user: User) => {
        setIsProcessing(true);
        const result = await adminSendVerificationEmail(user.id);
        if (result.success) {
            showResult(true, `Email weryfikacyjny wysłany do ${user.email}`);
        } else {
            showResult(false, result.error || "Błąd wysyłania");
        }
        setIsProcessing(false);
    };

    const handleSetPassword = async () => {
        if (!selectedUser || !newPassword) return;

        setIsProcessing(true);
        const result = await adminSetUserPassword(selectedUser.id, newPassword);
        if (result.success) {
            showResult(true, `Hasło zmienione dla ${selectedUser.email}`);
            setPasswordDialogOpen(false);
        } else {
            showResult(false, result.error || "Błąd zmiany hasła");
        }
        setIsProcessing(false);
    };

    const handleBan = async () => {
        if (!selectedUser) return;

        setIsProcessing(true);
        try {
            await authClient.admin.banUser({
                userId: selectedUser.id,
                banReason: banReason || undefined,
            });

            setBanDialogOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Failed to ban user:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUnban = async (userId: string) => {
        setIsProcessing(true);
        try {
            await authClient.admin.unbanUser({ userId });
            fetchUsers();
        } catch (error) {
            console.error("Failed to unban user:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRoleChange = async () => {
        if (!selectedUser) return;

        setIsProcessing(true);
        try {
            await authClient.admin.setRole({
                userId: selectedUser.id,
                role: newRole,
            });

            setRoleDialogOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Failed to change role:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEditUser = async () => {
        if (!selectedUser) return;

        setIsProcessing(true);
        try {
            await updateUserAdmin(selectedUser.id, { name: editName, email: editEmail });
            setEditDialogOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Failed to update user:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        setIsProcessing(true);
        try {
            await authClient.admin.removeUser({ userId: selectedUser.id });
            setDeleteDialogOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Failed to delete user:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const formatDate = (date: string | undefined) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getUserStatus = (user: User) => {
        if (user.banned) {
            return (
                <Badge variant="destructive" className="gap-1">
                    <Ban className="h-3 w-3" />
                    {t("admin.users.banned")}
                </Badge>
            );
        }
        if (!user.emailVerified) {
            return (
                <Badge variant="secondary" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    {t("admin.users.unverified")}
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                <CheckCircle className="h-3 w-3" />
                {t("admin.users.active")}
            </Badge>
        );
    };

    const totalPages = Math.ceil(total / PAGE_SIZE);

    if (isPending || !session || userRole !== "admin") {
        return null;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold">{t("admin.users.title")}</h1>
                        <p className="text-muted-foreground">{t("admin.users.description")}</p>
                    </div>
                </div>
                <Badge variant="secondary" className="text-sm">
                    {total} {t("admin.stats.users").toLowerCase()}
                </Badge>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={t("admin.users.searchPlaceholder")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button type="submit" variant="secondary">
                    {t("admin.users.search")}
                </Button>
            </form>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">{t("admin.users.table.user")}</TableHead>
                            <TableHead>{t("admin.users.table.role")}</TableHead>
                            <TableHead>{t("admin.users.table.status")}</TableHead>
                            <TableHead>{t("admin.users.table.joined")}</TableHead>
                            <TableHead className="text-right">{t("admin.users.actions")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    {t("admin.users.noUsers")}
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.image ?? undefined} />
                                                <AvatarFallback className="text-xs">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">{user.name}</p>
                                                <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                                                    <Mail className="h-3 w-3 shrink-0" />
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.role === "admin" ? (
                                            <Badge className="gap-1 bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-500">
                                                <Crown className="h-3 w-3" />
                                                Admin
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">User</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{getUserStatus(user)}</TableCell>
                                    <TableCell>
                                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(user.createdAt)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>{t("admin.users.actions")}</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    {t("admin.users.edit")}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openRoleDialog(user)}>
                                                    <Shield className="mr-2 h-4 w-4" />
                                                    {t("admin.users.changeRole")}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleSendResetPassword(user)}>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Wyślij reset hasła
                                                </DropdownMenuItem>
                                                {!user.emailVerified && (
                                                    <DropdownMenuItem onClick={() => handleSendVerificationEmail(user)}>
                                                        <Send className="mr-2 h-4 w-4" />
                                                        Wyślij weryfikację
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem onClick={() => openPasswordDialog(user)}>
                                                    <KeyRound className="mr-2 h-4 w-4" />
                                                    Ustaw hasło
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {user.banned ? (
                                                    <DropdownMenuItem onClick={() => handleUnban(user.id)}>
                                                        <UserCheck className="mr-2 h-4 w-4" />
                                                        {t("admin.users.unban")}
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        onClick={() => openBanDialog(user)}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Ban className="mr-2 h-4 w-4" />
                                                        {t("admin.users.ban")}
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem
                                                    onClick={() => openDeleteDialog(user)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    {t("admin.users.delete")}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, total)} / {total}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">
                            {page} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Ban Dialog */}
            <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("admin.users.banDialog.title")}</DialogTitle>
                        <DialogDescription>
                            {t("admin.users.banDialog.description")} {selectedUser?.name}?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>{t("admin.users.banDialog.reason")}</Label>
                            <Textarea
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                                placeholder={t("admin.users.banDialog.reasonPlaceholder")}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
                            {t("admin.users.banDialog.cancel")}
                        </Button>
                        <Button variant="destructive" onClick={handleBan} disabled={isProcessing}>
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t("admin.users.banDialog.confirm")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Role Dialog */}
            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("admin.users.roleDialog.title")}</DialogTitle>
                        <DialogDescription>
                            {t("admin.users.roleDialog.description")} {selectedUser?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>{t("admin.users.roleDialog.role")}</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={newRole === "user" ? "default" : "outline"}
                                    onClick={() => setNewRole("user")}
                                    className="flex-1"
                                >
                                    User
                                </Button>
                                <Button
                                    type="button"
                                    variant={newRole === "admin" ? "default" : "outline"}
                                    onClick={() => setNewRole("admin")}
                                    className="flex-1"
                                >
                                    <Crown className="mr-2 h-4 w-4" />
                                    Admin
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
                            {t("admin.users.roleDialog.cancel")}
                        </Button>
                        <Button onClick={handleRoleChange} disabled={isProcessing}>
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t("admin.users.roleDialog.confirm")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("admin.users.editDialog.title")}</DialogTitle>
                        <DialogDescription>
                            {t("admin.users.editDialog.description")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>{t("admin.users.editDialog.name")}</Label>
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("admin.users.editDialog.email")}</Label>
                            <Input
                                type="email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            {t("admin.users.editDialog.cancel")}
                        </Button>
                        <Button onClick={handleEditUser} disabled={isProcessing}>
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t("admin.users.editDialog.confirm")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("admin.users.deleteDialog.title")}</DialogTitle>
                        <DialogDescription>
                            {t("admin.users.deleteDialog.description")} {selectedUser?.name}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            {t("admin.users.deleteDialog.cancel")}
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUser} disabled={isProcessing}>
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t("admin.users.deleteDialog.confirm")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Password Dialog */}
            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ustaw nowe hasło</DialogTitle>
                        <DialogDescription>
                            Ustaw nowe hasło dla użytkownika {selectedUser?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nowe hasło</Label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Minimum 8 znaków"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                            Anuluj
                        </Button>
                        <Button onClick={handleSetPassword} disabled={isProcessing || newPassword.length < 8}>
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Ustaw hasło
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Action Result Toast */}
            {actionResult && (
                <div className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg z-50 ${actionResult.success
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}>
                    {actionResult.success ? (
                        <CheckCircle className="h-5 w-5" />
                    ) : (
                        <XCircle className="h-5 w-5" />
                    )}
                    <span>{actionResult.message}</span>
                </div>
            )}
        </div>
    );
}
