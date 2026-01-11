"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react";
import type { FileTreeBlock as FileTreeBlockType, FileTreeItem } from "../types";

interface Props {
    block: FileTreeBlockType;
}

function TreeItem({ item, level = 0 }: { item: FileTreeItem; level?: number }) {
    const [expanded, setExpanded] = useState(true);
    const isFolder = item.type === "folder";
    const hasChildren = isFolder && item.children && item.children.length > 0;

    return (
        <div>
            <div
                className={`flex items-center gap-1.5 py-1 px-2 rounded hover:bg-muted/50 cursor-pointer ${item.highlight ? "bg-primary/10 text-primary" : ""
                    }`}
                style={{ paddingLeft: `${level * 16 + 8}px` }}
                onClick={() => hasChildren && setExpanded(!expanded)}
            >
                {isFolder ? (
                    <>
                        {hasChildren ? (
                            expanded ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />
                        ) : <span className="w-4" />}
                        {expanded ? (
                            <FolderOpen className="h-4 w-4 text-yellow-500 shrink-0" />
                        ) : (
                            <Folder className="h-4 w-4 text-yellow-500 shrink-0" />
                        )}
                    </>
                ) : (
                    <>
                        <span className="w-4" />
                        <File className="h-4 w-4 text-muted-foreground shrink-0" />
                    </>
                )}
                <span className="text-sm font-mono truncate">{item.name}</span>
            </div>
            {hasChildren && expanded && (
                <div>
                    {item.children!.map((child, i) => (
                        <TreeItem key={i} item={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function FileTreeBlock({ block }: Props) {
    return (
        <div className="my-6">
            {block.title && (
                <h4 className="text-sm font-semibold mb-2">{block.title}</h4>
            )}
            <div className="border border-border rounded-lg bg-muted/30 py-2">
                {block.items.map((item, i) => (
                    <TreeItem key={i} item={item} />
                ))}
            </div>
        </div>
    );
}
