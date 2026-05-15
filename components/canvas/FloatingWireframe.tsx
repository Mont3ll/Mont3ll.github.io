"use client";

import { cx } from "@/lib/cx";

interface FloatingWireframeProps {
  className?: string;
}

export function FloatingWireframe({ className = "" }: FloatingWireframeProps) {
  return (
    <div
      className={cx(
        "floating-wireframe landscape relative overflow-visible bg-transparent",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#fbfaf7] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-44 bg-gradient-to-l from-[#fbfaf7] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-[#fbfaf7] to-transparent" />
      <WireSvg className="absolute -inset-x-24 inset-y-0 h-full w-[calc(100%+12rem)]" />
    </div>
  );
}

function WireSvg({ className = "absolute inset-0 h-full w-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 760 390"
      className={className}
      fill="none"
      preserveAspectRatio="none"
    >
      {Array.from({ length: 32 }).map((_, i) => (
        <path
          key={i}
          className="wave-line"
          d={`M-120 ${265 + i * 4.6} C 55 ${130 + i * 2.4}, 180 ${315 - i * 2.1}, 330 ${230 + i * 2.2} S 560 ${120 + i * 4.4}, 900 ${210 + i * 3}`}
          stroke="black"
          strokeOpacity={0.12}
        />
      ))}
      {[330, 430, 530, 650].map((x, i) => (
        <g key={x} className="marker-line">
          <path
            d={`M${x} 238 V${92 + i * 15}`}
            stroke="black"
            strokeOpacity="0.55"
          />
          <circle cx={x} cy={92 + i * 15} r="2" fill="black" />
        </g>
      ))}
    </svg>
  );
}
