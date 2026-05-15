"use client";

import { ParticleWord } from "@/components/canvas/ParticleWord";
import { SplitText } from "@/components/motion/SplitText";
import { Arrow } from "@/components/ui/Arrow";
import { ViewTransitionLink } from "@/components/motion/ViewTransitionLink";

export default function HomePage() {
  return (
    <div className="relative min-h-[545px] overflow-visible pb-24 pt-14 md:pt-20">
      <div className="home-particle-field pointer-events-none absolute -inset-x-10 -bottom-24 -top-28 z-0 md:-inset-x-28 md:-bottom-32 md:-top-36">
        <ParticleWord
          word="mont3ll"
          mobileWord="3"
          className="h-full w-full"
          density={2}
          particleSize={0.9}
          repelRadius={190}
          repelStrength={14}
          originX={0.72}
          originY={0.55}
          maxTextWidth={0.52}
          mobileOriginX={0.5}
          mobileOriginY={0.64}
          mobileMaxTextWidth={0.98}
        />
      </div>
      <div className="relative z-10 grid gap-12 md:grid-cols-[0.48fr_0.52fr]">
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="relative z-20 max-w-[560px] text-[52px] leading-[1.08] tracking-[-0.075em] md:text-[74px]">
              <SplitText>I build software that solves real problems.</SplitText>
            </h1>
            <p className="mt-9 max-w-[390px] text-[16px] leading-6 text-black/70">
              Full-stack developer focused on clean code, performance, and great user experiences.
            </p>
            <ViewTransitionLink
              href="/work"
              className="group mt-9 inline-block border-b border-black pb-2 text-[14px] transition-opacity hover:opacity-60"
            >
              View my work <Arrow />
            </ViewTransitionLink>
          </div>
        </div>
        <div className="min-h-[390px]" />
      </div>
    </div>
  );
}
