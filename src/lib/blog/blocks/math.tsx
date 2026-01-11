"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import type { MathBlock as MathBlockType } from "../types";

interface Props {
    block: MathBlockType;
}

export function MathBlock({ block }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            katex.render(block.formula, ref.current, {
                displayMode: !block.inline,
                throwOnError: false,
            });
        }
    }, [block.formula, block.inline]);

    if (block.inline) {
        return <span ref={ref} className="inline-block" />;
    }

    return (
        <div className="my-6">
            <div ref={ref} className="overflow-x-auto py-4 text-center" />
            {block.caption && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                    {block.caption}
                </p>
            )}
        </div>
    );
}
