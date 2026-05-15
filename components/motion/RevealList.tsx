"use client";

import { useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { clamp } from "@/lib/clamp";

interface RevealListItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: number]: any;
}

interface RevealListProps<T extends RevealListItem> {
  items: T[];
  className?: string;
  rowClassName?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  onSelect?: (item: T, index: number) => void;
  onActiveChange?: (index: number, event: React.MouseEvent) => void;
  onCollapse?: () => void;
}

export function RevealList<T extends RevealListItem>({
  items,
  className = "mt-12",
  rowClassName = "",
  renderItem,
  onSelect,
  onActiveChange,
  onCollapse,
}: RevealListProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);
  const activeRowRef = useRef<{ index: number; row: HTMLButtonElement } | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverBox, setHoverBox] = useState({
    top: 0, height: 0, opacity: 0, scale: 0, origin: "50%", shiftX: 0, shiftY: 0,
  });

  const activateRow = (event: React.MouseEvent, index: number) => {
    const list = listRef.current;
    const row = event.currentTarget as HTMLButtonElement;
    if (!list || !row) return;

    const listRect = list.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const pointerX = clamp(event.clientX - rowRect.left, 0, rowRect.width);
    const pointerY = clamp(event.clientY - rowRect.top, 0, rowRect.height);
    const centerX = rowRect.width / 2;
    const centerY = rowRect.height / 2;

    activeRowRef.current = { index, row };
    setActiveIndex(index);
    onActiveChange?.(index, event);
    setHoverBox({
      top: rowRect.top - listRect.top,
      height: rowRect.height,
      opacity: 1,
      scale: 1,
      origin: pointerY < rowRect.height / 2 ? "0%" : "100%",
      shiftX: clamp((pointerX - centerX) * 0.018, -3, 3),
      shiftY: clamp((pointerY - centerY) * 0.045, -3, 3),
    });
  };

  const handleRowMove = (event: React.MouseEvent, index: number) => {
    if (activeIndex !== index) activateRow(event, index);
  };

  const collapseBackground = (event?: React.MouseEvent) => {
    onCollapse?.();
    const row = activeRowRef.current?.row;
    let exitOrigin = hoverBox.origin;
    let exitShiftX = hoverBox.shiftX;
    let exitShiftY = hoverBox.shiftY;

    if (event?.clientY != null && row) {
      const rowRect = row.getBoundingClientRect();
      const pointerX = clamp(event.clientX - rowRect.left, 0, rowRect.width);
      const pointerY = event.clientY - rowRect.top;
      const centerX = rowRect.width / 2;
      const centerY = rowRect.height / 2;

      if (event.clientY < rowRect.top) exitOrigin = "0%";
      else if (event.clientY > rowRect.bottom) exitOrigin = "100%";
      else exitOrigin = pointerY < rowRect.height / 2 ? "0%" : "100%";

      exitShiftX = clamp((pointerX - centerX) * 0.018, -3, 3);
      exitShiftY = clamp((clamp(pointerY, 0, rowRect.height) - centerY) * 0.045, -3, 3);
    }

    setActiveIndex(null);
    activeRowRef.current = null;
    setHoverBox((box) => ({
      ...box,
      origin: exitOrigin,
      scale: 0,
      opacity: 1,
      shiftX: exitShiftX * 0.35,
      shiftY: exitShiftY * 0.35,
    }));
    window.setTimeout(() => {
      setHoverBox((box) => (box.scale === 0 ? { ...box, opacity: 0, shiftX: 0, shiftY: 0 } : box));
    }, 360);
  };

  return (
    <div
      ref={listRef}
      className={cx(
        "work-reveal-list reveal-list",
        className,
        activeIndex !== null && "has-active",
        activeIndex === null && hoverBox.opacity === 1 && "is-collapsing"
      )}
      onMouseLeave={collapseBackground}
      style={{
        "--hover-top": `${hoverBox.top}px`,
        "--hover-height": `${hoverBox.height}px`,
        "--hover-opacity": hoverBox.opacity,
        "--hover-scale": hoverBox.scale,
        "--hover-origin": hoverBox.origin,
        "--hover-shift-x": `${hoverBox.shiftX}px`,
        "--hover-shift-y": `${hoverBox.shiftY}px`,
      } as React.CSSProperties}
    >
      <div className="work-reveal-bg" />
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelect?.(item, index)}
          onMouseEnter={(e) => activateRow(e, index)}
          onMouseMove={(e) => handleRowMove(e, index)}
          onFocus={(e) => activateRow(e as unknown as React.MouseEvent, index)}
          onBlur={() => collapseBackground()}
          className={cx(
            "work-reveal-row group w-full border-b border-black/10 text-left",
            rowClassName,
            activeIndex === index && "is-active"
          )}
        >
          {renderItem(item, index)}
        </button>
      ))}
    </div>
  );
}
