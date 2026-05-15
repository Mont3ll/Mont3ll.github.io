"use client";

import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";
import { Logo } from "./Logo";
import { MagneticNavLink } from "@/components/motion/MagneticNavLink";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { MobileMenuButton } from "./MobileMenuButton";

const NAV_ITEMS = ["work", "blog", "about", "skills", "contact"] as const;

interface TopNavProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export function TopNav({ theme, toggleTheme }: TopNavProps) {
  const pathname = usePathname();

  const isActive = (item: string) => {
    if (item === "blog") return pathname.startsWith("/blog");
    if (item === "work") return pathname.startsWith("/work");
    return pathname === `/${item}`;
  };

  return (
    <header className="top-nav-wrap px-7 py-7 md:px-10">
      <div className="flex items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-10 text-[13px] lowercase md:flex">
          {NAV_ITEMS.map((item) => (
            <MagneticNavLink
              key={item}
              href={`/${item}`}
              className={cx("nav-link", isActive(item) && "is-active")}
            >
              {item}
              <span className="awwwards-dot absolute -bottom-3 left-1/2 h-1 w-1 -translate-x-1/2 translate-y-1 scale-0 rounded-full bg-black opacity-0" />
            </MagneticNavLink>
          ))}
          <MagneticButton
            onClick={toggleTheme}
            className="nav-magnetic-dot relative flex items-center justify-center"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="theme-toggle-indicator" aria-hidden="true" />
          </MagneticButton>
        </nav>
        <MobileMenuButton theme={theme} toggleTheme={toggleTheme} />
      </div>
    </header>
  );
}
