"use client";

import { cx } from "@/lib/cx";
import { ViewTransitionLink } from "@/components/motion/ViewTransitionLink";

interface LogoProps {
  dark?: boolean;
}

export function Logo({ dark = false }: LogoProps) {
  return (
    <ViewTransitionLink
      href="/"
      className={cx(
        "prompt-logo text-[26px] leading-none transition-opacity hover:opacity-60",
        dark ? "text-white" : "text-black"
      )}
      aria-label="Go home"
    >
      <span className="prompt-logo-prefix">›</span>
      <span className="prompt-logo-cursor" aria-hidden="true" />
      <span>mont3ll</span>
    </ViewTransitionLink>
  );
}
