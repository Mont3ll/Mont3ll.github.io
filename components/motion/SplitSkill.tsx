"use client";

import { cx } from "@/lib/cx";
import { skillEffects, type SkillEffect } from "@/data/skills";

interface SplitSkillProps {
  label: string;
  variant?: SkillEffect;
}

export function SplitSkill({ label, variant = "plop" }: SplitSkillProps) {
  const chars = [...label];
  const center = (chars.length - 1) / 2;

  return (
    <span
      className={cx("skill-split-item", `skill-effect-${variant}`)}
      tabIndex={0}
      aria-label={label}
    >
      <span className="skill-split-text" aria-hidden="true">
        {chars.map((char, index) => {
          const distance = Math.abs(index - center);
          const wave =
            chars.length <= 1 ? 1 : 1 - distance / Math.max(center, 1);
          const zig = index % 2 === 0 ? 1 : -1;
          return (
            <span
              key={`${label}-${char}-${index}`}
              className="skill-split-char"
              data-char={char === " " ? " " : char}
              style={{
                "--char-index": index,
                "--char-center": center,
                "--wave": Number(wave.toFixed(3)),
                "--zig": zig,
                "--phase": Number(
                  ((index + 1) / Math.max(chars.length, 1)).toFixed(3)
                ),
              } as React.CSSProperties}
            >
              {char === " " ? "\u00a0" : char}
            </span>
          );
        })}
      </span>
    </span>
  );
}

export { getSkillVariant } from "@/lib/skillVariant";

