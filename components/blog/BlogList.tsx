"use client";

import { RevealList } from "@/components/motion/RevealList";
import { ViewTransitionLink } from "@/components/motion/ViewTransitionLink";
import { posts } from "@/data/posts";
import { Arrow } from "@/components/ui/Arrow";

export function BlogList() {
  return (
    <div className="grid gap-12 pb-16 pt-14 md:grid-cols-[0.36fr_0.64fr] md:gap-0 md:pb-0 md:pt-0">
      {/* Left — fixed, non-scrolling */}
      <div className="md:sticky md:top-0 md:self-start md:py-20 md:pr-10">
        <h1 className="text-[52px] tracking-[-0.07em] md:text-[70px]">Blog.</h1>
        <p className="mt-8 max-w-[270px] text-[16px] leading-6 text-black/70">
          Thoughts on systems, engineering, and the tools I actually use.
        </p>
        <ViewTransitionLink
          href={`/blog/${posts[0].slug}`}
          className="group mt-10 inline-block border-b border-black pb-2 text-[14px]"
        >
          Read latest post <Arrow />
        </ViewTransitionLink>
      </div>

      {/* Right — scrollable, no visible scrollbar */}
      <div className="post-scroll-pane md:h-[calc(100dvh-160px)] md:overflow-y-auto md:py-8">
        <RevealList
          items={posts}
          className="blog-reveal-list"
          rowClassName="grid grid-cols-[118px_minmax(0,1fr)_40px] items-center py-6 md:grid-cols-[190px_minmax(0,1fr)_120px_42px]"
          onSelect={() => {}}
          renderItem={(post) => (
            <>
              <span className="text-[13px] text-black/45">{post.date}</span>
              <ViewTransitionLink
                href={`/blog/${post.slug}`}
                className="text-[20px] tracking-[-0.04em] md:text-[22px]"
              >
                {post.title}
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
