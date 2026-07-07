"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { type Project } from "@/data/projects";
import { RevealList } from "@/components/motion/RevealList";
import { ViewTransitionLink } from "@/components/motion/ViewTransitionLink";
import { clamp } from "@/lib/clamp";

interface WorkProjectListProps {
  projects: Project[];
}

function ProjectHoverPreview({
  projects,
  activeIndex,
  pointer,
  visible,
}: {
  projects: Project[];
  activeIndex: number | null;
  pointer: { x: number; y: number; rotate: number };
  visible: boolean;
}) {
  // Use a mounted flag so both SSR and the initial client render return null,
  // avoiding the hydration mismatch that createPortal(…, document.body) causes.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div
      className="project-hover-preview"
      style={{
        left: `${pointer.x}px`,
        top: `${pointer.y}px`,
        "--preview-opacity": visible ? 1 : 0,
        "--preview-scale": visible ? 1 : 0,
        "--preview-index": activeIndex ?? 0,
        "--preview-rotate": pointer.rotate ?? 0,
      } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="project-hover-preview-frame">
        <div className="project-hover-preview-strip">
          {projects.map((project) => (
            <div key={project.title} className="project-hover-slide">
              {project.previewImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.previewImage} alt="" className="project-hover-image" />
              ) : null}
              <div className="project-hover-slide-inner">
                <div className="project-hover-slide-mark">
                  <span>{project.number}</span>
                  <span>{project.type}</span>
                </div>
                <div className="project-hover-slide-title">{project.title}</div>
                <div className="project-hover-slide-footer">
                  <span>{project.summary}</span>
                  <span>view</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function WorkProjectList({ projects }: WorkProjectListProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0, rotate: 0 });
  const [previewVisible, setPreviewVisible] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const lastXRef = useRef(0);
  const targetPointerRef = useRef({ x: 0, y: 0, rotate: 0 });
  const previewVisibleRef = useRef(false);
  const activeIndexRef = useRef<number | null>(null);
  const leaveTimerRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const tick = () => {
      setPointer((current) => {
        const target = targetPointerRef.current;
        const ease = previewVisibleRef.current ? 0.0038 : 0.0022;
        const next = {
          x: current.x + (target.x - current.x) * ease,
          y: current.y + (target.y - current.y) * ease,
          rotate: current.rotate + (target.rotate - current.rotate) * 0.006,
        };
        if (Math.abs(next.x - target.x) < 0.1) next.x = target.x;
        if (Math.abs(next.y - target.y) < 0.1) next.y = target.y;
        if (Math.abs(next.rotate - target.rotate) < 0.05) next.rotate = target.rotate;
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => { previewVisibleRef.current = previewVisible; }, [previewVisible]);
  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);

  useEffect(() => {
    const handleWindowMove = (event: MouseEvent) => {
      if (activeIndexRef.current === null) return;
      updatePointer(event, null, false, true);
    };
    window.addEventListener("mousemove", handleWindowMove);
    return () => {
      window.removeEventListener("mousemove", handleWindowMove);
      window.clearTimeout(leaveTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePointer = (
    event: MouseEvent | React.MouseEvent,
    rowElement: HTMLElement | null = null,
    immediate = false,
    allowOutside = false
  ) => {
    const deltaX = lastXRef.current === 0 ? 0 : event.clientX - lastXRef.current;
    lastXRef.current = event.clientX;
    const previewWidth = Math.min(320, window.innerWidth * 0.34);
    const previewHeight = Math.min(238, window.innerWidth * 0.2537);
    const rowRect = rowElement?.getBoundingClientRect();
    const rowCenterY = rowRect ? rowRect.top + rowRect.height / 2 : event.clientY;
    const magneticY = rowRect
      ? rowCenterY + (event.clientY - rowCenterY) * 0.32
      : event.clientY;
    const overflow = allowOutside ? previewWidth * 0.72 : 8;
    const target = {
      x: clamp(event.clientX, previewWidth / 2 + 8 - overflow, window.innerWidth - previewWidth / 2 - 8 + overflow),
      y: clamp(magneticY, previewHeight / 2 + 8 - overflow * 0.45, window.innerHeight - previewHeight / 2 - 8 + overflow * 0.45),
      rotate: clamp(deltaX * 0.08, -6, 6),
    };
    targetPointerRef.current = target;
    if (immediate || pointer.x === 0) setPointer(target);
  };

  const handleMove = (event: React.MouseEvent) => {
    const row = (event.target as HTMLElement)?.closest?.(".work-reveal-row") as HTMLElement | null;
    updatePointer(event, row, false, false);
  };

  const hidePreview = () => {
    setPreviewVisible(false);
    previewVisibleRef.current = false;
    window.clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = window.setTimeout(() => {
      setActiveIndex(null);
      activeIndexRef.current = null;
      lastXRef.current = 0;
    }, 520);
  };

  const beginSoftLeave = (event: React.MouseEvent) => {
    updatePointer(event, null, false, true);
    hidePreview();
  };

  return (
    <div
      ref={galleryRef}
      className="project-gallery-list"
      onMouseMove={handleMove}
      onMouseLeave={beginSoftLeave}
    >
      <RevealList
        items={projects}
        onSelect={(project) => {}}
        onActiveChange={(index, event) => {
          setActiveIndex(index);
          activeIndexRef.current = index;
          setPreviewVisible(true);
          previewVisibleRef.current = true;
          window.clearTimeout(leaveTimerRef.current);
          if (event) updatePointer(event, event.currentTarget as HTMLElement, activeIndexRef.current === null);
        }}
        onCollapse={() => {}}
        rowClassName="grid grid-cols-[44px_minmax(0,1fr)_40px] items-center py-6 md:grid-cols-[70px_minmax(0,1fr)_minmax(0,1fr)_170px_42px]"
        renderItem={(project) => (
          <>
            <span className="text-[13px] text-black/45">{project.number}</span>
            <ViewTransitionLink
              href={`/work/${project.slug}`}
              className="text-[20px] tracking-[-0.04em] md:text-[22px]"
            >
              <span style={{ viewTransitionName: `project-title-${project.slug}` }}>
                {project.title}
              </span>
            </ViewTransitionLink>
            <span className="hidden text-[14px] text-black/60 md:block">{project.summary}</span>
            <span className="hidden text-[14px] text-black/60 md:block">{project.type}</span>
            <span className="reveal-list-arrow">→</span>
          </>
        )}
      />
      <ProjectHoverPreview
        projects={projects}
        activeIndex={activeIndex}
        pointer={pointer}
        visible={previewVisible && activeIndex !== null}
      />
    </div>
  );
}
