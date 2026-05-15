"use client";

import { useEffect, useRef } from "react";

/**
 * Attaches a lerp-based smooth scroll with inertia/damping to a DOM element.
 * Falls back to native scroll on touch devices and when reduced motion is preferred.
 *
 * @param ease  0–1 damping coefficient (lower = more drag). 0.08 is gentle, 0.14 is snappy.
 */
export function useLerpScroll<T extends HTMLElement>(ease = 0.1) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect accessibility preference and let touch devices use native momentum scroll
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let target = el.scrollTop;
    let current = el.scrollTop;
    let raf = 0;

    const lerp = () => {
      const delta = target - current;
      if (Math.abs(delta) < 0.4) {
        el.scrollTop = target;
        current = target;
        raf = 0;
        return;
      }
      current += delta * ease;
      el.scrollTop = current;
      raf = requestAnimationFrame(lerp);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Re-sync current in case the element was scrolled by other means (e.g. keyboard)
      current = el.scrollTop;
      const max = el.scrollHeight - el.clientHeight;
      target = Math.max(0, Math.min(max, target + e.deltaY));
      if (!raf) raf = requestAnimationFrame(lerp);
    };

    // Keyboard support — arrow keys, Page Down/Up, Space
    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement !== el && !el.contains(document.activeElement)) return;
      const step = el.clientHeight * 0.15;
      const page = el.clientHeight * 0.9;
      const max = el.scrollHeight - el.clientHeight;
      const deltas: Record<string, number> = {
        ArrowDown: step, ArrowUp: -step,
        PageDown: page, PageUp: -page,
        Space: e.shiftKey ? -page : page,
      };
      const d = deltas[e.key];
      if (d == null) return;
      e.preventDefault();
      current = el.scrollTop;
      target = Math.max(0, Math.min(max, target + d));
      if (!raf) raf = requestAnimationFrame(lerp);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [ease]);

  return ref;
}
