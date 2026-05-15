"use client";

import { useRef, useState } from "react";
import { cx } from "@/lib/cx";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strengthX?: number;
  strengthY?: number;
  "aria-label"?: string;
}

export function MagneticButton({
  children,
  className = "",
  onClick,
  strengthX = 0.18,
  strengthY = 0.26,
  "aria-label": ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [style, setStyle] = useState({ transform: "translate3d(0,0,0)" });

  const move = (event: React.MouseEvent) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    setStyle({ transform: `translate3d(${x * strengthX}px, ${y * strengthY}px, 0)` });
  };

  return (
    <button
      ref={ref}
      onMouseMove={move}
      onMouseLeave={() => setStyle({ transform: "translate3d(0,0,0)" })}
      onClick={onClick}
      style={style}
      className={cx("magnetic-target group", className)}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
