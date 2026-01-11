"use client";

import type { TableBlock as TableBlockType } from "../types";

interface Props {
    block: TableBlockType;
}

export function TableBlock({ block }: Props) {
    return (
        <div className="my-6 overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-border">
                        {block.columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-4 py-3 text-left font-semibold"
                                style={{ color: col.color }}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {block.rows.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={`border-b border-border/50 ${block.striped && rowIndex % 2 === 1 ? "bg-muted/30" : ""
                                }`}
                        >
                            {block.columns.map((col) => (
                                <td key={col.key} className="px-4 py-3">
                                    {row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {block.caption && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                    {block.caption}
                </p>
            )}
        </div>
    );
}
