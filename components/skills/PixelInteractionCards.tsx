"use client";

import { useMemo, useState } from "react";
import { PixelCanvas } from "@/components/canvas/PixelCanvas";

interface PixelIconProps {
  type: "layout" | "code" | "systems" | "craft";
}

export function PixelIcon({ type }: PixelIconProps) {
  const common = {
    width: 36,
    height: 36,
    viewBox: "0 0 42 42",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.35,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (type === "layout")
    return (
      <svg {...common}>
        <rect x="7" y="9" width="28" height="24" rx="2" />
        <path d="M7 16h28M16 16v17" />
      </svg>
    );
  if (type === "code")
    return (
      <svg {...common}>
        <path d="M17 13 9 21l8 8M25 13l8 8-8 8M23 10l-4 22" />
      </svg>
    );
  if (type === "systems")
    return (
      <svg {...common}>
        <path d="M21 7v8M21 27v8M7 21h8M27 21h8" />
        <circle cx="21" cy="21" r="6" />
        <circle cx="21" cy="7" r="2" />
        <circle cx="35" cy="21" r="2" />
        <circle cx="21" cy="35" r="2" />
        <circle cx="7" cy="21" r="2" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M10 29 28 11l3 3-18 18-6 2 3-5Z" />
      <path d="M25 14l3 3" />
    </svg>
  );
}

interface PixelCardProps {
  title: string;
  icon: React.ReactNode;
  colors: string[];
  gap?: number;
  speed?: number;
  activeColor?: string;
}

export function PixelCard({
  title,
  icon,
  colors,
  gap = 5,
  speed = 35,
  activeColor = "#111111",
}: PixelCardProps) {
  const [active, setActive] = useState(false);

  return (
    <div
      className="pixel-card"
      style={{ "--active-color": activeColor } as React.CSSProperties}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <PixelCanvas active={active} gap={gap} speed={speed} colors={colors} />
      <div className="pixel-card-content">
        <div className="pixel-card-icon">{icon}</div>
        <p className="pixel-card-title">{title}</p>
      </div>
      <button type="button" aria-label={title} />
    </div>
  );
}

export function PixelInteractionCards() {
  const mono = useMemo(() => ["#111111", "#525252", "#d4d4d4"], []);
  return (
    <div className="pixel-card-grid mt-8">
      <PixelCard title="Layout"  icon={<PixelIcon type="layout"  />} colors={mono} />
      <PixelCard title="Code"    icon={<PixelIcon type="code"    />} colors={mono} />
      <PixelCard title="Systems" icon={<PixelIcon type="systems" />} colors={mono} />
      <PixelCard title="Craft"   icon={<PixelIcon type="craft"   />} colors={mono} />
    </div>
  );
}
