"use client";

import { cn } from "@/lib/utils";

export const AuroraBackground = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 opacity-50 blur-[100px]">
        <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] animate-[aurora_60s_linear_infinite] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <div className="absolute -right-1/4 top-1/4 h-[600px] w-[600px] animate-[aurora_45s_linear_infinite] rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
        <div className="absolute left-1/3 -bottom-1/4 h-[400px] w-[400px] animate-[aurora_50s_linear_infinite] rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />
      </div>
    </div>
  );
};
