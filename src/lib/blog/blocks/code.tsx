"use client";

import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CodeBlock as CodeBlockType } from "../types";

interface Props {
    block: CodeBlockType;
}

export function CodeBlock({ block }: Props) {
    const [copied, setCopied] = useState(false);
    const [highlightedCode, setHighlightedCode] = useState<string | null>(null);

    useEffect(() => {
        const highlight = async () => {
            try {
                const { codeToHtml } = await import("shiki");
                const html = await codeToHtml(block.code, {
                    lang: block.language || "text",
                    theme: "github-dark",
                });
                setHighlightedCode(html);
            } catch {
                // Fallback to plain text if language not supported
                setHighlightedCode(null);
            }
        };
        highlight();
    }, [block.code, block.language]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(block.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative my-6 rounded-lg border bg-[#0d1117] overflow-hidden">
            {block.filename && (
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#30363d] bg-[#161b22]">
                    <span className="text-sm text-[#8b949e] font-mono">
                        {block.filename}
                    </span>
                    <span className="text-xs text-[#8b949e] uppercase">
                        {block.language}
                    </span>
                </div>
            )}
            <div className="relative">
                {highlightedCode ? (
                    <div
                        className="p-4 overflow-x-auto text-sm [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!bg-transparent"
                        dangerouslySetInnerHTML={{ __html: highlightedCode }}
                    />
                ) : (
                    <pre className="p-4 overflow-x-auto">
                        <code className="text-sm text-[#c9d1d9]">
                            {block.code}
                        </code>
                    </pre>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 text-[#8b949e] hover:text-white hover:bg-[#30363d]"
                    onClick={handleCopy}
                >
                    {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    );
}
