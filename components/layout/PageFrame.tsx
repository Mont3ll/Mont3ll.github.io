"use client";

import { cx } from "@/lib/cx";
import { TopNav } from "./TopNav";
import { BottomStatus } from "./BottomStatus";
import { Preloader } from "@/components/motion/Preloader";
import { fontStack } from "@/data/site";
import { usePreloader } from "@/hooks/usePreloader";
import { useTheme } from "@/hooks/useTheme";
import { useViewTransition } from "@/hooks/useViewTransition";

interface PageFrameProps {
  children: React.ReactNode;
}

export function PageFrame({ children }: PageFrameProps) {
  const { preloaderMounted, preloaderDone } = usePreloader();
  const [theme, rawToggle] = useTheme();
  const runViewTransition = useViewTransition();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    runViewTransition(rawToggle, "theme");
  };

  return (
    <main
      className={cx(
        "portfolio-shell h-screen min-h-screen w-full overflow-x-hidden",
        isDark && "theme-dark"
      )}
      style={{ fontFamily: fontStack }}
    >
      <section className="portfolio-frame motion-page relative mx-auto flex h-full max-w-[1920px] flex-col overflow-x-hidden">
        <TopNav theme={theme} toggleTheme={toggleTheme} />
        {/*
          overflow-y: auto lets page content scroll inside the frame.
          overflow-x: clip clips horizontal overflow without creating a scroll container,
          so the y-axis is not normalised to auto and hero particles can extend beyond
          the centred content column unclipped.
        */}
        <div className="page-content flex-1">
          <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8">
            {children}
          </div>
        </div>
        <BottomStatus />
        {preloaderMounted && <Preloader done={preloaderDone} />}
      </section>
    </main>
  );
}
