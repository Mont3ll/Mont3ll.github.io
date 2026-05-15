"use client";

import { useCallback } from "react";
import { flushSync } from "react-dom";

export function useViewTransition() {
  const runViewTransition = useCallback(
    (update: () => void, mode: "page" | "theme" = "page") => {
      const canTransition =
        typeof document !== "undefined" &&
        typeof (document as Document & { startViewTransition?: unknown })
          .startViewTransition === "function";

      if (!canTransition) {
        update();
        return;
      }

      if (mode === "theme") {
        document.documentElement.classList.add("theme-transition-active");
      }

      const transition = (
        document as Document & {
          startViewTransition: (cb: () => void) => { finished: Promise<void> };
        }
      ).startViewTransition(() => {
        flushSync(update);
      });

      transition.finished.finally(() => {
        document.documentElement.classList.remove("theme-transition-active");
      });
    },
    []
  );

  return runViewTransition;
}
