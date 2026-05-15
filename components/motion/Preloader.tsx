"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";

interface PreloaderProps {
  done: boolean;
}

export function Preloader({ done }: PreloaderProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = 1650;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={cx("preloader", done && "is-done")} aria-hidden={done}>
      <div className="preloader-inner">
        <div className="preloader-meta">
          <span>loading portfolio</span>
          <span className="preloader-count">{String(count).padStart(3, "0")}%</span>
        </div>
        <div className="preloader-mark prompt-logo">
          <span className="prompt-logo-prefix">›</span>
          <span className="prompt-logo-cursor" aria-hidden="true" />
          <span>mont3ll</span>
        </div>
        <div className="preloader-track">
          <div
            className="preloader-line"
            style={{ transform: `scaleX(${count / 100})` }}
          />
        </div>
      </div>
    </div>
  );
}
