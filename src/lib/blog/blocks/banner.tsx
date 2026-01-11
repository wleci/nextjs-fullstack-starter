"use client";

import { AlertCircle, AlertTriangle, CheckCircle, Info, RefreshCw } from "lucide-react";
import type { BannerBlock as BannerBlockType } from "../types";

interface Props {
    block: BannerBlockType;
}

const variants = {
    info: {
        bg: "bg-blue-500/10 border-blue-500/30",
        icon: Info,
        iconColor: "text-blue-500",
    },
    warning: {
        bg: "bg-yellow-500/10 border-yellow-500/30",
        icon: AlertTriangle,
        iconColor: "text-yellow-500",
    },
    error: {
        bg: "bg-red-500/10 border-red-500/30",
        icon: AlertCircle,
        iconColor: "text-red-500",
    },
    success: {
        bg: "bg-green-500/10 border-green-500/30",
        icon: CheckCircle,
        iconColor: "text-green-500",
    },
    update: {
        bg: "bg-purple-500/10 border-purple-500/30",
        icon: RefreshCw,
        iconColor: "text-purple-500",
    },
};

export function BannerBlock({ block }: Props) {
    const variant = variants[block.variant];
    const Icon = variant.icon;

    return (
        <div className={`my-6 p-4 rounded-lg border ${variant.bg}`}>
            <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${variant.iconColor}`} />
                <div>
                    <h4 className="font-semibold">{block.title}</h4>
                    {block.content && (
                        <p className="text-sm text-muted-foreground mt-1">{block.content}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
