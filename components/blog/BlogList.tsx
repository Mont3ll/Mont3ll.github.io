"use client";

import { RevealList } from "@/components/motion/RevealList";
import { ViewTransitionLink } from "@/components/motion/ViewTransitionLink";
import { posts } from "@/data/posts";
import { Arrow } from "@/components/ui/Arrow";
import { useLerpScroll } from "@/hooks/useLerpScroll";

export function BlogList() {
  const scrollRef = useLerpScroll<HTMLDivElement>(0.09);

  return (
    /*
     * The outer grid is capped at 100dvh minus nav+footer (~160 px) on desktop
     * so page-content never grows a secondary scrollbar.
     * On mobile the grid stacks and page-content scrolls naturally.
     */
    <div className="grid gap-12 pb-16 pt-14 md:h-[calc(100dvh-160px)] md:grid-cols-[0.36fr_0.64fr] md:gap-0 md:overflow-hidden md:pb-0 md:pt-0">

      {/* ── Left: fixed ──────────────────────────────────────────────── */}
      <div className="md:py-20 md:pr-10">
        <h1
          className="text-[52px] tracking-[-0.07em] md:text-[70px]"
          style={{ viewTransitionName: "page-heading" }}
        >
          Blog.
        </h1>
        <p className="mt-8 max-w-[270px] text-[16px] leading-6 text-black/70">
          Thoughts on systems, engineering, and the tools I actually use.
        </p>
        <ViewTransitionLink
          href={`/blog/${posts[0].slug}`}
          className="group mt-10 inline-block w-fit border-b border-black pb-2 text-[14px]"
        >
          Read latest post <Arrow />
        </ViewTransitionLink>
      </div>

      {/* ── Right: smooth-scrolling post list ─────────────────────────── */}
      <div
        ref={scrollRef}
        className="post-scroll-pane md:overflow-y-auto md:py-8"
      >
        <RevealList
          items={posts}
          className="blog-reveal-list"
          rowClassName="grid grid-cols-[118px_minmax(0,1fr)_40px] items-center py-6 md:grid-cols-[190px_minmax(0,1fr)_120px_42px]"
          onSelect={() => {}}
          renderItem={(post) => (
            <>
              <span className="text-[13px] text-black/45">{post.date}</span>
              {/* view-transition-name shared with the article h1 for hero-morph */}
              <ViewTransitionLink
                href={`/blog/${post.slug}`}
                className="text-[20px] tracking-[-0.04em] md:text-[22px]"
              >
                <span style={{ viewTransitionName: `post-title-${post.slug}` }}>
                  {post.title}
                </span>
              </ViewTransitionLink>
              <span className="hidden text-[13px] text-black/55 md:block">{post.category}</span>
              <span className="reveal-list-arrow">→</span>
            </>
          )}
        />
      </div>
    </div>
  );
}
