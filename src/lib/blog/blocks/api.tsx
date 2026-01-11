"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import type { ApiBlock as ApiBlockType } from "../types";

interface Props {
    block: ApiBlockType;
}

const methodColors: Record<string, string> = {
    GET: "bg-green-500",
    POST: "bg-blue-500",
    PUT: "bg-yellow-500",
    PATCH: "bg-orange-500",
    DELETE: "bg-red-500",
};

export function ApiBlock({ block }: Props) {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyEndpoint = () => {
        navigator.clipboard.writeText(block.endpoint);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-6 border border-border rounded-lg overflow-hidden">
            <div
                className="flex items-center gap-3 p-4 bg-muted/50 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <span className={`${methodColors[block.method]} text-white text-xs font-bold px-2 py-1 rounded`}>
                    {block.method}
                </span>
                <code className="flex-1 text-sm font-mono">{block.endpoint}</code>
                <button
                    onClick={(e) => { e.stopPropagation(); copyEndpoint(); }}
                    className="p-1 hover:bg-muted rounded"
                >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>

            {expanded && (
                <div className="p-4 space-y-4 border-t border-border">
                    {block.description && (
                        <p className="text-sm text-muted-foreground">{block.description}</p>
                    )}

                    {block.params && block.params.length > 0 && (
                        <div>
                            <h5 className="text-sm font-semibold mb-2">Parametry</h5>
                            <div className="space-y-2">
                                {block.params.map((param, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm">
                                        <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                                            {param.name}
                                        </code>
                                        <span className="text-muted-foreground">{param.type}</span>
                                        {param.required && (
                                            <span className="text-red-500 text-xs">wymagane</span>
                                        )}
                                        {param.description && (
                                            <span className="text-muted-foreground">- {param.description}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {block.body && (
                        <div>
                            <h5 className="text-sm font-semibold mb-2">Body</h5>
                            <pre className="bg-[#1e1e1e] p-3 rounded text-sm overflow-x-auto">
                                <code className="text-gray-300">{block.body}</code>
                            </pre>
                        </div>
                    )}

                    {block.response && (
                        <div>
                            <h5 className="text-sm font-semibold mb-2">Response</h5>
                            <pre className="bg-[#1e1e1e] p-3 rounded text-sm overflow-x-auto">
                                <code className="text-gray-300">{block.response}</code>
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
