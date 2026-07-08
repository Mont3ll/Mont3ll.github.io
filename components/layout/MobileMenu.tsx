"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";
import { ViewTransitionLink } from "@/components/motion/ViewTransitionLink";

const NAV_ITEMS = ["home", "work", "blog", "about", "skills", "contact"] as const;

interface MobileMenuProps {
  close: () => void;
  closing: boolean;
  metrics: {
    closedTop: string;
    closedLeft: string;
    closedWidth: string;
    closedHeight: string;
    openTop: string;
    openLeft: string;
    openWidth: string;
    openHeight: string;
  };
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export function MobileMenu({ close, closing, metrics, theme, toggleTheme }: MobileMenuProps) {
  const pathname = usePathname();

  const isActive = (item: string) => {
    if (item === "home") return pathname === "/";
    if (item === "blog") return pathname.startsWith("/blog");
    if (item === "work") return pathname.startsWith("/work");
    return pathname === `/${item}`;
  };

  const style = {
    "--closed-top": metrics.closedTop,
    "--closed-left": metrics.closedLeft,
    "--closed-width": metrics.closedWidth,
    "--closed-height": metrics.closedHeight,
    "--open-top": metrics.openTop,
    "--open-left": metrics.openLeft,
    "--open-width": metrics.openWidth,
    "--open-height": metrics.openHeight,
    "--closed-radius": "7px",
    "--open-radius": "7px",
  } as React.CSSProperties;

  return (
    <div className="side-menu-overlay md:hidden">
      <button aria-label="Close menu" onClick={close} className="side-menu-backdrop" />
      <div
        className={cx(
          "side-menu-morph",
          theme === "dark" && "side-menu-theme-dark",
          closing && "is-closing"
        )}
        style={style}
      >
        <nav className={cx("side-menu-panel", closing && "is-closing")}>
          <div className="side-menu-kicker mb-8 flex items-center justify-between border-b pb-4 text-[13px]">
            <span>navigate</span>
            <span>mont3ll</span>
          </div>
          <div className="focus-nav-list grid gap-1">
            {NAV_ITEMS.map((item, index) => (
              <ViewTransitionLink
                key={item}
                href={item === "home" ? "/" : `/${item}`}
                onClick={close}
                className={cx(
                  "focus-nav-link group flex items-center justify-between py-3",
                  isActive(item) && "opacity-100"
                )}
              >
                <span className="text-[42px] leading-none tracking-[-0.075em]">{item}</span>
                <span className="side-menu-index flex items-center gap-4 text-[13px]">
                  {String(index + 1).padStart(2, "0")}
                  <span className="side-menu-arrow transition-transform group-hover:translate-x-1">→</span>
                </span>
              </ViewTransitionLink>
            ))}
          </div>
          <div className="side-menu-footer">
            <div className="side-menu-socials">
              <a className="side-menu-social-link" href="https://github.com/mont3ll" target="_blank" rel="noreferrer">
                GitHub <span>↗</span>
              </a>
              <a className="side-menu-social-link" href="https://www.linkedin.com/in/montell-luseno" target="_blank" rel="noreferrer">
                LinkedIn <span>↗</span>
              </a>
              <a className="side-menu-social-link" href="mailto:meluseno@gmail.com">
                Email <span>→</span>
              </a>
            </div>
            <div className="side-menu-theme-row">
              <span>theme</span>
              <button
                type="button"
                onClick={toggleTheme}
                className={cx("side-menu-theme-toggle", theme === "dark" && "is-dark")}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                <span>{theme === "dark" ? "dark" : "light"}</span>
                <span className="side-menu-theme-knob" aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
