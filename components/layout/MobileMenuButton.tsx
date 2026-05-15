"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { clamp } from "@/lib/clamp";
import { MobileMenu } from "./MobileMenu";

interface MobileMenuButtonProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export function MobileMenuButton({ theme, toggleTheme }: MobileMenuButtonProps) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [menuMetrics, setMenuMetrics] = useState({
    closedTop: "28px",
    closedLeft: "calc(100vw - 104px)",
    closedWidth: "76px",
    closedHeight: "34px",
    openTop: "16px",
    openLeft: "16px",
    openWidth: "min(430px, calc(100vw - 28px))",
    openHeight: "min(610px, calc(100dvh - 28px))",
  });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const update = () => {
      const compact = window.matchMedia("(max-width: 767px)").matches;
      setIsCompact(compact);
      if (!compact) {
        setOpen(false);
        setClosing(false);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const measureOrigin = () => {
    const node = buttonRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const frame =
      node.closest("section")?.getBoundingClientRect() ?? {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    const localLeft = rect.left - frame.left;
    const localTop = rect.top - frame.top;
    const frameWidth = frame.width || window.innerWidth;
    const frameHeight = frame.height || window.innerHeight;
    const openWidth = Math.min(430, frameWidth - 28);
    const openHeight = Math.min(610, frameHeight - 28);
    const openInset = 14;
    const openLeft = clamp(localLeft - 12, openInset, frameWidth - openWidth - openInset);
    const openTop = clamp(localTop - 12, openInset, frameHeight - openHeight - openInset);
    setMenuMetrics({
      closedTop: `${localTop}px`,
      closedLeft: `${localLeft}px`,
      closedWidth: `${rect.width}px`,
      closedHeight: `${rect.height}px`,
      openTop: `${openTop}px`,
      openLeft: `${openLeft}px`,
      openWidth: `${openWidth}px`,
      openHeight: `${openHeight}px`,
    });
  };

  const show = () => {
    measureOrigin();
    setClosing(false);
    setOpen(true);
  };

  const hide = () => {
    if (!open || closing) return;
    measureOrigin();
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 560);
  };

  if (!isCompact) return null;

  return (
    <>
      <button
        ref={buttonRef}
        className={cx(
          "side-menu-button side-menu-mobile-only md:hidden",
          open && !closing && "is-open"
        )}
        onClick={() => (open ? hide() : show())}
        aria-expanded={open && !closing}
        aria-label={open ? "Close navigation" : "Open navigation"}
      >
        <span className="side-menu-slider" aria-hidden="true">
          <span className="side-menu-el">
            <span className="side-menu-perspective">
              <span>menu</span>
              <span>menu</span>
            </span>
          </span>
          <span className="side-menu-el">
            <span className="side-menu-perspective">
              <span>close</span>
              <span>close</span>
            </span>
          </span>
        </span>
        <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
      </button>
      {open && (
        <MobileMenu
          close={hide}
          closing={closing}
          metrics={menuMetrics}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
    </>
  );
}
