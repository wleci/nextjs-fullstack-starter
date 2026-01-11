"use client";

import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import type { TerminalBlock as TerminalBlockType } from "../types";

interface Props {
    block: TerminalBlockType;
}

export function TerminalBlock({ block }: Props) {
    const [copied, setCopied] = useState<number | null>(null);

    const copyCommand = (command: string, index: number) => {
        navigator.clipboard.writeText(command);
        setCopied(index);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="my-6">
            <div className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-border">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] border-b border-border">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-sm text-gray-400 flex items-center gap-1.5 ml-2">
                        <Terminal className="h-3.5 w-3.5" />
                        {block.title || "Terminal"}
                    </span>
                </div>
                <div className="p-4 font-mono text-sm">
                    {block.commands.map((cmd, i) => (
                        <div key={i} className="mb-2 last:mb-0">
                            <div className="flex items-center group">
                                <span className="text-green-400 mr-2">$</span>
                                <span className="text-gray-100 flex-1">{cmd.command}</span>
                                <button
                                    onClick={() => copyCommand(cmd.command, i)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                                >
                                    {copied === i ? (
                                        <Check className="h-4 w-4 text-green-400" />
                                    ) : (
                                        <Copy className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {cmd.output && (
                                <div className="text-gray-400 mt-1 pl-4 whitespace-pre-wrap">
                                    {cmd.output}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
