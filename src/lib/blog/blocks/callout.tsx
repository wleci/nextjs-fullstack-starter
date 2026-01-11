import { Info, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import type { CalloutBlock as CalloutBlockType } from "../types";

interface Props {
    block: CalloutBlockType;
}

const variants = {
    info: {
        icon: Info,
        className: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-200",
    },
    warning: {
        icon: AlertTriangle,
        className: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/50 dark:border-yellow-800 dark:text-yellow-200",
    },
    error: {
        icon: XCircle,
        className: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-800 dark:text-red-200",
    },
    success: {
        icon: CheckCircle,
        className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/50 dark:border-green-800 dark:text-green-200",
    },
};

export function CalloutBlock({ block }: Props) {
    const variant = variants[block.variant];
    const Icon = variant.icon;

    return (
        <div className={`my-6 flex gap-3 rounded-lg border p-4 ${variant.className}`}>
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
                {block.title && (
                    <p className="font-semibold mb-1">{block.title}</p>
                )}
                <p dangerouslySetInnerHTML={{ __html: block.content }} />
            </div>
        </div>
    );
}
