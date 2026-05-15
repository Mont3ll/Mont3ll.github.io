"use client";

import { Dot } from "@/components/ui/Dot";

export function BottomStatus() {
  return (
    <div className="flex shrink-0 items-center justify-between border-t border-black/8 px-7 py-5 text-[12px] md:px-10">
      <span>© 2026 mont3ll</span>
      <span>
        Available for work{" "}
        <span className="ml-2">
          <Dot />
        </span>
      </span>
    </div>
  );
}
