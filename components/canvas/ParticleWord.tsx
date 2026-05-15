"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/lib/cx";
import { clamp } from "@/lib/clamp";
import { getCanvasSize, configureCanvas } from "@/lib/canvas";

interface ParticleWordProps {
  word?: string;
  children?: string;
  className?: string;
  density?: number;
  particleSize?: number;
  repelRadius?: number;
  repelStrength?: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: number;
  letterSpacing?: number;
  originX?: number;
  originY?: number;
  maxTextWidth?: number;
  mobileOriginX?: number;
  mobileOriginY?: number;
  mobileMaxTextWidth?: number;
  mobileWord?: string;
}

export function ParticleWord({
  word = "3ll",
  children,
  className = "h-[360px] w-full",
  density = 3,
  particleSize = 1,
  repelRadius = 110,
  repelStrength = 7,
  color = "17,17,17",
  fontFamily = "Avenir Next, Helvetica Neue, Arial, sans-serif",
  fontWeight = 700,
  letterSpacing = -0.08,
  originX = 0.5,
  originY = 0.49,
  maxTextWidth = 0.86,
  mobileOriginX,
  mobileOriginY,
  mobileMaxTextWidth,
  mobileWord,
}: ParticleWordProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const text = String(children ?? word);
  const mobileText = mobileWord ? String(mobileWord) : text;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: true })!;
    type Particle = {
      baseX: number; baseY: number; x: number; y: number;
      vx: number; vy: number; size: number; sizeStep: number;
      exitSpeed: number; minSize: number; maxSize: number; maxSizeInteger: number;
      speed: number; delay: number; counter: number; counterStep: number;
      reverse: boolean; shimmer: boolean; color: string; alpha: number; phase: number;
    };
    const particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let resizeRaf = 0;
    let width = 0;
    let height = 0;
    const friction = 0.86;
    const returnEase = 0.068;
    const jitter = 0.18;
    const gap = Math.max(2, density);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shimmerVelocity = reduced ? 0 : 0.042;
    const colorRamp = [
      `rgba(${color},1)`,
      `rgba(${color},.66)`,
      `rgba(${color},.28)`,
    ];
    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    const fitText = (
      context: CanvasRenderingContext2D,
      label: string,
      maxWidth: number,
      startSize: number
    ): number => {
      let size = startSize;
      context.font = `${fontWeight} ${size}px ${fontFamily}`;
      while (context.measureText(label).width > maxWidth && size > 18) {
        size -= 4;
        context.font = `${fontWeight} ${size}px ${fontFamily}`;
      }
      return size;
    };

    const buildParticles = () => {
      const size = getCanvasSize(wrap, 280, 240);
      if (size.width === width && size.height === height && particles.length) return;
      width = size.width;
      height = size.height;
      configureCanvas(canvas, ctx, width, height);

      const off = document.createElement("canvas");
      const offCtx = off.getContext("2d", { willReadFrequently: true })!;
      off.width = width;
      off.height = height;
      offCtx.clearRect(0, 0, width, height);
      offCtx.fillStyle = "#000";
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";

      const isMobile = width < 700;
      const label = isMobile ? mobileText : text;
      const effectiveMaxTextWidth = isMobile
        ? (mobileMaxTextWidth ?? maxTextWidth)
        : maxTextWidth;
      const effectiveOriginX = isMobile ? (mobileOriginX ?? originX) : originX;
      const effectiveOriginY = isMobile ? (mobileOriginY ?? originY) : originY;
      const startSize = Math.min(
        width / Math.max(label.length * 0.32, 1.8),
        height * 0.64
      );
      const finalSize = fitText(offCtx, label, width * effectiveMaxTextWidth, startSize);
      offCtx.font = `${fontWeight} ${finalSize}px ${fontFamily}`;

      const chars = [...label];
      const spacing = finalSize * letterSpacing;
      const widths = chars.map((ch) => offCtx.measureText(ch).width);
      const totalWidth =
        widths.reduce((a, b) => a + b, 0) +
        spacing * Math.max(0, chars.length - 1);
      let x = clamp(
        width * effectiveOriginX - totalWidth / 2,
        18,
        width - totalWidth - 18
      );
      const y = height * effectiveOriginY;
      chars.forEach((ch, i) => {
        offCtx.fillText(ch, x + widths[i] / 2, y);
        x += widths[i] + spacing;
      });

      const data = offCtx.getImageData(0, 0, width, height).data;
      particles.length = 0;
      for (let py = 0; py < height; py += gap) {
        for (let px = 0; px < width; px += gap) {
          const alpha = data[(py * width + px) * 4 + 3];
          if (alpha > 80) {
            const dx = px - width / 2;
            const dy = py - height / 2;
            const scatterAngle = Math.random() * Math.PI * 2;
            const scatterDistance =
              140 + Math.random() * Math.max(width, height) * 0.38;
            particles.push({
              baseX: px, baseY: py,
              x: px + Math.cos(scatterAngle) * scatterDistance,
              y: py + Math.sin(scatterAngle) * scatterDistance,
              vx: 0, vy: 0, size: 0,
              sizeStep: random(0.08, 0.22) * particleSize,
              exitSpeed: random(0.08, 0.16),
              minSize: Math.max(0.45, particleSize * 0.42),
              maxSize: random(1.05, 2.45) * particleSize,
              maxSizeInteger: Math.max(2, particleSize * 3.2),
              speed: random(0.18, 0.92) * shimmerVelocity,
              delay: reduced ? 0 : Math.sqrt(dx * dx + dy * dy),
              counter: random(0, 16),
              counterStep: random(5, 10) + (width + height) * 0.006,
              reverse: false, shimmer: false,
              color: colorRamp[Math.floor(Math.random() * colorRamp.length)],
              alpha: 0.34 + Math.random() * 0.5,
              phase: Math.random() * Math.PI * 2,
            });
          }
        }
      }
    };

    const scheduleRebuild = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(buildParticles);
    };

    const updatePointer = (event: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const point =
        (event as TouchEvent).touches?.[0] ??
        (event as MouseEvent);
      mouse.x = (point as Touch | MouseEvent).clientX - rect.left;
      mouse.y = (point as Touch | MouseEvent).clientY - rect.top;
    };

    const clearPointer = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const draw = (time: number) => {
      const tick = time * 0.001;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (p.counter <= p.delay) {
          p.counter += p.counterStep;
          continue;
        }
        if (p.size >= p.maxSize) p.shimmer = true;
        if (p.shimmer) {
          if (p.size >= p.maxSize) p.reverse = true;
          if (p.size <= p.minSize) p.reverse = false;
          p.size += p.reverse ? -p.speed : p.speed;
        } else {
          p.size += p.sizeStep;
        }

        const targetX = p.baseX + Math.cos(tick * 1.4 + p.phase) * jitter;
        const targetY = p.baseY + Math.sin(tick * 1.6 + p.phase) * jitter;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < repelRadius * repelRadius) {
          const dist = Math.max(1, Math.sqrt(distSq));
          const force = (1 - dist / repelRadius) * repelStrength;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        p.vx += (targetX - p.x) * returnEase;
        p.vy += (targetY - p.y) * returnEase;
        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx;
        p.y += p.vy;

        const blockSize = Math.max(1, p.size * 1.65);
        const centerOffset = p.maxSizeInteger * 0.5 - blockSize * 0.5;
        ctx.globalAlpha = Math.max(0.2, p.alpha + Math.sin(tick * 2.2 + p.phase) * 0.1);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x + centerOffset, p.y + centerOffset, blockSize, blockSize);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    buildParticles();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", scheduleRebuild);
    window.addEventListener("orientationchange", scheduleRebuild);
    window.addEventListener("mousemove", updatePointer);
    window.addEventListener("touchmove", updatePointer, { passive: true });
    window.addEventListener("mouseleave", clearPointer);
    window.addEventListener("touchend", clearPointer);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", scheduleRebuild);
      window.removeEventListener("orientationchange", scheduleRebuild);
      window.removeEventListener("mousemove", updatePointer);
      window.removeEventListener("touchmove", updatePointer);
      window.removeEventListener("mouseleave", clearPointer);
      window.removeEventListener("touchend", clearPointer);
    };
  }, [
    text, mobileText, density, particleSize, repelRadius, repelStrength,
    color, fontFamily, fontWeight, letterSpacing, originX, originY,
    maxTextWidth, mobileOriginX, mobileOriginY, mobileMaxTextWidth,
  ]);

  return (
    <div ref={wrapRef} className={cx("particle-stage relative overflow-visible", className)}>
      <canvas
        ref={canvasRef}
        className="particle-canvas absolute inset-0 h-full w-full"
        aria-label={`Interactive particle word ${text}`}
        role="img"
      />
    </div>
  );
}
