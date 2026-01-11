"use client";

import { useEffect, useState, useRef } from "react";
import type { StatsBlock as StatsBlockType } from "../types";

interface Props {
    block: StatsBlockType;
}

function AnimatedNumber({ value, prefix, suffix }: { value: string | number; prefix?: string; suffix?: string }) {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const numericValue = typeof value === "number" ? value : parseFloat(value.replace(/[^0-9.-]/g, ""));
    const isNumeric = !isNaN(numericValue);

    useEffect(() => {
        if (!isNumeric) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    const duration = 1500;
                    const steps = 60;
                    const increment = numericValue / steps;
                    let current = 0;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= numericValue) {
                            setDisplayValue(numericValue);
                            clearInterval(timer);
                        } else {
                            setDisplayValue(Math.floor(current));
                        }
                    }, duration / steps);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [numericValue, isNumeric]);

    return (
        <div ref={ref} className="text-3xl font-bold">
            {prefix}
            {isNumeric ? displayValue.toLocaleString() : value}
            {suffix}
        </div>
    );
}

export function StatsBlock({ block }: Props) {
    const columns = block.columns || 3;
    const gridCols = {
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
    }[columns];

    return (
        <div className={`my-6 grid ${gridCols} gap-4`}>
            {block.items.map((item, i) => (
                <div
                    key={i}
                    className="text-center p-6 rounded-lg bg-muted/30 border border-border"
                >
                    <div style={{ color: item.color }}>
                        <AnimatedNumber
                            value={item.value}
                            prefix={item.prefix}
                            suffix={item.suffix}
                        />
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">{item.label}</div>
                </div>
            ))}
        </div>
    );
}
