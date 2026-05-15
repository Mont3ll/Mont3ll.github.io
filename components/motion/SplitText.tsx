"use client";

import { cx } from "@/lib/cx";

interface SplitTextProps {
  children: string;
  className?: string;
}

export function SplitText({ children, className = "" }: SplitTextProps) {
  return (
    <span className={className}>
      {String(children)
        .split(" ")
        .map((word, index) => (
          <span key={`${word}-${index}`} className="split-word mr-[0.18em]">
            <span style={{ animationDelay: `${180 + index * 42}ms` }}>{word}</span>
          </span>
        ))}
    </span>
  );
}
