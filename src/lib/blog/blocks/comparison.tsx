"use client";

import { Check, X } from "lucide-react";
import type { ComparisonBlock as ComparisonBlockType } from "../types";

interface Props {
    block: ComparisonBlockType;
}

export function ComparisonBlock({ block }: Props) {
    const leftColor = block.leftColor || "#ef4444";
    const rightColor = block.rightColor || "#22c55e";

    return (
        <div className="my-6 grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border overflow-hidden">
                <div
                    className="px-4 py-3 font-semibold text-white"
                    style={{ backgroundColor: leftColor }}
                >
                    {block.leftTitle}
                </div>
                <div className="p-4 space-y-2">
                    {block.leftItems.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <X className="h-5 w-5 shrink-0 mt-0.5" style={{ color: leftColor }} />
                            <span className="text-sm">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
                <div
                    className="px-4 py-3 font-semibold text-white"
                    style={{ backgroundColor: rightColor }}
                >
                    {block.rightTitle}
                </div>
                <div className="p-4 space-y-2">
                    {block.rightItems.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <Check className="h-5 w-5 shrink-0 mt-0.5" style={{ color: rightColor }} />
                            <span className="text-sm">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
