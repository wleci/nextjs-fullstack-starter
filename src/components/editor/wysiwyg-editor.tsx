"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
    Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon, ImageIcon,
    Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const lowlight = createLowlight(common);

interface WysiwygEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export function WysiwygEditor({ content, onChange, placeholder }: WysiwygEditorProps) {
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [imageAlt, setImageAlt] = useState("");

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            Placeholder.configure({
                placeholder: placeholder || "Zacznij pisać...",
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline",
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-lg max-w-full h-auto",
                },
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: "bg-muted p-4 rounded-lg font-mono text-sm",
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4",
            },
        },
    });

    if (!editor) {
        return null;
    }

    const handleAddLink = () => {
        if (linkUrl) {
            editor.chain().focus().setLink({ href: linkUrl }).run();
            setLinkUrl("");
            setLinkDialogOpen(false);
        }
    };

    const handleAddImage = () => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run();
            setImageUrl("");
            setImageAlt("");
            setImageDialogOpen(false);
        }
    };

    return (
        <div className="border rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? "bg-muted" : ""}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? "bg-muted" : ""}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive("strike") ? "bg-muted" : ""}
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={editor.isActive("code") ? "bg-muted" : ""}
                >
                    <Code className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
                >
                    <Heading3 className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive("bulletList") ? "bg-muted" : ""}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive("orderedList") ? "bg-muted" : ""}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive("blockquote") ? "bg-muted" : ""}
                >
                    <Quote className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive("codeBlock") ? "bg-muted" : ""}
                >
                    <Code2 className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setLinkDialogOpen(true)}
                    className={editor.isActive("link") ? "bg-muted" : ""}
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setImageDialogOpen(true)}
                >
                    <ImageIcon className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />

            {/* Link Dialog */}
            <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Dodaj link</DialogTitle>
                        <DialogDescription>Wpisz URL linku</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="link-url">URL</Label>
                        <Input
                            id="link-url"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="https://example.com"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                            Anuluj
                        </Button>
                        <Button onClick={handleAddLink}>Dodaj</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Image Dialog */}
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Dodaj obrazek</DialogTitle>
                        <DialogDescription>Wpisz URL obrazka</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="image-url">URL</Label>
                            <Input
                                id="image-url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image-alt">Alt text (opcjonalnie)</Label>
                            <Input
                                id="image-alt"
                                value={imageAlt}
                                onChange={(e) => setImageAlt(e.target.value)}
                                placeholder="Opis obrazka"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
                            Anuluj
                        </Button>
                        <Button onClick={handleAddImage}>Dodaj</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
