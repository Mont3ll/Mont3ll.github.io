"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clamp } from "@/lib/clamp";
import { getCanvasSize, configureCanvas } from "@/lib/canvas";

interface PixelCanvasProps {
  active?: boolean;
  gap?: number;
  speed?: number;
  colors?: string[];
}

export function PixelCanvas({
  active = false,
  gap = 5,
  speed = 35,
  colors = ["#111111", "#525252", "#d4d4d4"],
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  type Pixel = {
    x: number; y: number; size: number; sizeStep: number; exitSpeed: number;
    minSize: number; maxSize: number; maxSizeInteger: number; speed: number;
    delay: number; counter: number; counterStep: number; reverse: boolean;
    shimmer: boolean; color: string;
  };
  const pixelsRef = useRef<Pixel[]>([]);
  const rafRef = useRef(0);
  const resizeRafRef = useRef(0);
  const activeRef = useRef(active);
  const runningRef = useRef(false);

  const drawLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const { width, height } = getCanvasSize(canvas, 1, 1);
    ctx.clearRect(0, 0, width, height);
    let shouldContinue = activeRef.current;

    pixelsRef.current.forEach((pixel) => {
      if (activeRef.current) {
        if (pixel.counter <= pixel.delay) {
          pixel.counter += pixel.counterStep;
          shouldContinue = true;
          return;
        }
        if (pixel.size >= pixel.maxSize) pixel.shimmer = true;
        if (pixel.shimmer) {
          if (pixel.size >= pixel.maxSize) pixel.reverse = true;
          if (pixel.size <= pixel.minSize) pixel.reverse = false;
          pixel.size += pixel.reverse ? -pixel.speed : pixel.speed;
        } else {
          pixel.size += pixel.sizeStep;
        }
      } else {
        pixel.shimmer = false;
        pixel.reverse = false;
        pixel.counter = 0;
        pixel.size = Math.max(0, pixel.size - pixel.exitSpeed);
        if (pixel.size > 0) shouldContinue = true;
      }

      if (pixel.size > 0) {
        const centerOffset = pixel.maxSizeInteger * 0.5 - pixel.size * 0.5;
        ctx.fillStyle = pixel.color;
        ctx.fillRect(
          pixel.x + centerOffset,
          pixel.y + centerOffset,
          pixel.size,
          pixel.size
        );
      }
    });

    if (shouldContinue) rafRef.current = requestAnimationFrame(drawLoop);
    else runningRef.current = false;
  }, []);

  const startLoop = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    rafRef.current = requestAnimationFrame(drawLoop);
  }, [drawLoop]);

  useEffect(() => {
    activeRef.current = active;
    startLoop();
  }, [active, startLoop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clampedGap = clamp(gap, 4, 50);
    const velocity = reduced ? 0 : clamp(speed, 0, 100) * 0.001;
    const random = (min: number, max: number) => Math.random() * (max - min) + min;
    let lastWidth = 0;
    let lastHeight = 0;

    const build = () => {
      const { width, height } = getCanvasSize(canvas, 1, 1);
      if (width === lastWidth && height === lastHeight && pixelsRef.current.length) return;
      lastWidth = width;
      lastHeight = height;
      configureCanvas(canvas, ctx, width, height);
      const pixels: Pixel[] = [];
      for (let x = 0; x < width; x += clampedGap) {
        for (let y = 0; y < height; y += clampedGap) {
          const dx = x - width / 2;
          const dy = y - height / 2;
          pixels.push({
            x, y, size: 0, sizeStep: random(0.16, 0.42),
            exitSpeed: random(0.12, 0.24), minSize: 0.35,
            maxSize: random(0.55, 1.75), maxSizeInteger: 2,
            speed: random(0.18, 0.9) * velocity,
            delay: reduced ? 0 : Math.sqrt(dx * dx + dy * dy),
            counter: 0, counterStep: random(3, 8) + (width + height) * 0.008,
            reverse: false, shimmer: false,
            color: colors[Math.floor(Math.random() * colors.length)].trim(),
          });
        }
      }
      pixelsRef.current = pixels;
      startLoop();
    };

    const scheduleBuild = () => {
      cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(build);
    };

    build();
    window.addEventListener("resize", scheduleBuild);
    window.addEventListener("orientationchange", scheduleBuild);
    return () => {
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(resizeRafRef.current);
      window.removeEventListener("resize", scheduleBuild);
      window.removeEventListener("orientationchange", scheduleBuild);
      runningRef.current = false;
    };
  }, [gap, speed, colors, startLoop]);

  return <canvas className="pixel-canvas" ref={canvasRef} aria-hidden="true" />;
}
