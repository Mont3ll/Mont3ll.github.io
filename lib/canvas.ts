export function getCanvasSize(
  node: Element | null | undefined,
  minWidth = 1,
  minHeight = 1
): { width: number; height: number } {
  const rect = node?.getBoundingClientRect?.() ?? { width: 0, height: 0 };
  return {
    width: Math.max(minWidth, Math.floor(rect.width)),
    height: Math.max(minHeight, Math.floor(rect.height)),
  };
}

export function configureCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const nextWidth = Math.max(1, Math.floor(width * dpr));
  const nextHeight = Math.max(1, Math.floor(height * dpr));
  if (canvas.width !== nextWidth) canvas.width = nextWidth;
  if (canvas.height !== nextHeight) canvas.height = nextHeight;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
