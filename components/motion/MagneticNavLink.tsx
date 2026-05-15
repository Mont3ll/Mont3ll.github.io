"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cx } from "@/lib/cx";

// Semantically correct nav link: renders as <a> with magnetic hover effect
// and fires document.startViewTransition() before pushing the new route.

interface MagneticNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  strengthX?: number;
  strengthY?: number;
}

export function MagneticNavLink({
  href,
  children,
  className = "",
  strengthX = 0.18,
  strengthY = 0.26,
}: MagneticNavLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const router = useRouter();
  const [style, setStyle] = useState({ transform: "translate3d(0,0,0)" });

  const move = (event: React.MouseEvent) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    setStyle({ transform: `translate3d(${x * strengthX}px, ${y * strengthY}px, 0)` });
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("/")) return;
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (!doc.startViewTransition) return;
    e.preventDefault();
    doc.startViewTransition(() => router.push(href));
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={move}
      onMouseLeave={() => setStyle({ transform: "translate3d(0,0,0)" })}
      onClick={handleClick}
      style={style}
      className={cx("magnetic-target group", className)}
    >
      {children}
    </Link>
  );
}
