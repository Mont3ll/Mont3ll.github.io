import { skillEffects, type SkillEffect } from "@/data/skills";

export function getSkillVariant(
  group: string,
  item: string,
  index: number
): SkillEffect {
  const seed = `${group}:${item}:${index}`
    .split("")
    .reduce(
      (total, char, charIndex) =>
        total + char.charCodeAt(0) * (charIndex + 11),
      0
    );
  const mixed =
    (seed * 9301 +
      49297 +
      group.length * 233 +
      item.length * 101 +
      index * 7919) %
    233280;
  const variant = skillEffects[mixed % skillEffects.length];
  return skillEffects.includes(variant) ? variant : "plop";
}
