import { cx } from "@/lib/cx";

interface DotProps {
  dark?: boolean;
}

export function Dot({ dark = false }: DotProps) {
  return (
    <span
      className={cx(
        "pulse-dot inline-block h-2 w-2 rounded-full",
        dark ? "bg-white" : "bg-black"
      )}
    />
  );
}
