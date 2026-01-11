"use client";

import { useMemo } from "react";
import { diffLines } from "diff";
import type { DiffBlock as DiffBlockType } from "../types";

interface Props {
    block: DiffBlockType;
}

export function DiffBlock({ block }: Props) {
    const changes = useMemo(() => {
        return diffLines(block.before, block.after);
    }, [block.before, block.after]);

    return (
        <div className="my-6">
            {block.filename && (
                <div className="bg-muted px-4 py-2 rounded-t-lg border border-b-0 border-border text-sm font-mono">
                    {block.filename}
                </div>
            )}
            <div className={`overflow-x-auto bg-[#1e1e1e] ${block.filename ? "rounded-b-lg" : "rounded-lg"}`}>
                <pre className="p-4 text-sm font-mono">
                    {changes.map((part, i) => {
                        const lines = part.value.split("\n").filter((_, idx, arr) =>
                            idx < arr.length - 1 || arr[idx] !== ""
                        );

                        return lines.map((line, j) => (
                            <div
                                key={`${i}-${j}`}
                                className={`${part.added
                                        ? "bg-green-500/20 text-green-400"
                                        : part.removed
                                            ? "bg-red-500/20 text-red-400"
                                            : "text-gray-300"
                                    }`}
                            >
                                <span className="inline-block w-6 text-gray-500 select-none">
                                    {part.added ? "+" : part.removed ? "-" : " "}
                                </span>
                                {line}
                            </div>
                        ));
                    })}
                </pre>
            </div>
        </div>
    );
}
