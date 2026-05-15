import { skills } from "@/data/skills";
import { getSkillVariant } from "@/lib/skillVariant";
import { SplitSkill } from "@/components/motion/SplitSkill";
import { PixelInteractionCards } from "@/components/skills/PixelInteractionCards";

export default function SkillsPage() {
  return (
    <div className="pb-24 pt-14 md:pt-20">
      <h1 className="text-[52px] tracking-[-0.07em] md:text-[70px]" style={{ viewTransitionName: "page-heading" }}>Skills &amp; tools.</h1>
      <p className="mt-4 max-w-[280px] text-[15px] text-black/70">
        Technologies I work with.
      </p>
      <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 md:mt-16 md:grid-cols-5 md:gap-10">
        {Object.entries(skills).map(([group, items]) => (
          <div key={group} className={group === "Tools" ? "col-span-2 md:col-span-1" : ""}>
            <h2 className="mb-5 text-[14px] font-semibold md:mb-7">{group}</h2>
            <ul className="space-y-4 text-[15px] text-black/72">
              {items.map((item, index) => (
                <li key={item}>
                  <SplitSkill label={item} variant={getSkillVariant(group, item, index)} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <PixelInteractionCards />
    </div>
  );
}
