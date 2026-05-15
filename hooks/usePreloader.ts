"use client";

import { useEffect, useState } from "react";

export function usePreloader(duration = 1750, removeDuration = 2700) {
  const [mounted, setMounted] = useState(true);
  const [done, setDone] = useState(false);
  const [homeEntryReady, setHomeEntryReady] = useState(false);

  useEffect(() => {
    const doneTimer = window.setTimeout(() => setDone(true), duration);
    const homeEntryTimer = window.setTimeout(
      () => setHomeEntryReady(true),
      duration + 350
    );
    const removeTimer = window.setTimeout(
      () => setMounted(false),
      removeDuration
    );
    return () => {
      window.clearTimeout(doneTimer);
      window.clearTimeout(homeEntryTimer);
      window.clearTimeout(removeTimer);
    };
  }, [duration, removeDuration]);

  return { preloaderMounted: mounted, preloaderDone: done, homeEntryReady };
}
