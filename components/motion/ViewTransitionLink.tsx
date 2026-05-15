"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

// Drop-in replacement for next/link that fires startViewTransition before navigating.
// Falls back to normal navigation on browsers without View Transitions support.

type Props = ComponentPropsWithoutRef<typeof Link>;

export function ViewTransitionLink({ href, onClick, children, ...rest }: Props) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const url = href.toString();
    // Pass through for external links or hash-only anchors
    if (!url.startsWith("/")) {
      onClick?.(e);
      return;
    }

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };

    if (!doc.startViewTransition) {
      onClick?.(e);
      return;
    }

    e.preventDefault();
    onClick?.(e);
    doc.startViewTransition(() => router.push(url));
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
