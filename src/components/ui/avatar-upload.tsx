"use client";

import { useState, useRef, useCallback } from "react";
import { Camera, Loader2, Trash2, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { uploadAvatar, deleteAvatar, AVATAR_CONFIG } from "@/lib/avatar";

interface AvatarUploadProps {
    /** Current avatar URL */
    currentImage?: string | null;
    /** User's name for fallback initials */
    name: string;
    /** Callback when avatar changes */
    onAvatarChange?: (url: string | null) => void;
    /** Translation strings */
    translations: {
        title: string;
        description: string;
        upload: string;
        delete: string;
        dragDrop: string;
        maxSize: string;
        uploading: string;
        success: string;
        error: string;
    };
}

/**
 * Avatar upload component with drag & drop support
 */
export function AvatarUpload({
    currentImage,
    name,
    onAvatarChange,
    translations: t,
}: AvatarUploadProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleFileSelect = useCallback(async (file: File) => {
        setError(null);

        // Validate file type
        if (!AVATAR_CONFIG.allowedTypes.includes(file.type as typeof AVATAR_CONFIG.allowedTypes[number])) {
            setError("Invalid file type");
            return;
        }

        // Validate file size
        if (file.size > AVATAR_CONFIG.maxSize) {
            setError("File too large (max 2MB)");
            return;
        }

        // Create preview
        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);

        // Upload file
        setIsUploading(true);

        const formData = new FormData();
        formData.append("avatar", file);

        const result = await uploadAvatar(formData);

        setIsUploading(false);
        URL.revokeObjectURL(preview);
        setPreviewUrl(null);

        if (result.success && result.url) {
            onAvatarChange?.(result.url);
            setIsOpen(false);
        } else {
            setError(result.error ?? t.error);
        }
    }, [onAvatarChange, t.error]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        const result = await deleteAvatar();

        setIsDeleting(false);

        if (result.success) {
            onAvatarChange?.(null);
            setIsOpen(false);
        } else {
            setError(result.error ?? t.error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="relative cursor-pointer group">
                    <Avatar className="h-24 w-24 transition-opacity group-hover:opacity-80">
                        <AvatarImage src={currentImage ?? undefined} />
                        <AvatarFallback className="text-2xl">
                            {getInitials(name)}
                        </AvatarFallback>
                    </Avatar>
                    <Button
                        size="icon"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                        type="button"
                    >
                        <Camera className="h-4 w-4" />
                    </Button>
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t.title}</DialogTitle>
                    <DialogDescription>{t.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Preview */}
                    <div className="flex justify-center">
                        <Avatar className="h-32 w-32">
                            <AvatarImage src={previewUrl ?? currentImage ?? undefined} />
                            <AvatarFallback className="text-3xl">
                                {getInitials(name)}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Error message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="rounded-md bg-destructive/10 p-3 text-sm text-destructive text-center"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Drop zone */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                            transition-colors duration-200
                            ${isDragging
                                ? "border-primary bg-primary/5"
                                : "border-muted-foreground/25 hover:border-primary/50"
                            }
                            ${isUploading ? "pointer-events-none opacity-50" : ""}
                        `}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={AVATAR_CONFIG.allowedTypes.join(",")}
                            onChange={handleInputChange}
                            className="hidden"
                            disabled={isUploading}
                        />

                        {isUploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">{t.uploading}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <p className="text-sm font-medium">{t.dragDrop}</p>
                                <p className="text-xs text-muted-foreground">{t.maxSize}</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading || isDeleting}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {t.upload}
                        </Button>

                        {currentImage && (
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isUploading || isDeleting}
                            >
                                {isDeleting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

