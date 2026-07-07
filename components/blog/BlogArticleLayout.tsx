"use client";

import { type Post } from "@/data/posts";
import { FloatingWireframe } from "@/components/canvas/FloatingWireframe";
import { ViewTransitionLink } from "@/components/motion/ViewTransitionLink";
import { getArticleBody } from "@/lib/article-content";
import { useLerpScroll } from "@/hooks/useLerpScroll";

interface BlogArticleLayoutProps {
  post: Post;
}

export function BlogArticleLayout({ post }: BlogArticleLayoutProps) {
  const ArticleBody = getArticleBody(post.slug);
  const scrollRef = useLerpScroll<HTMLDivElement>(0.09);

  return (
    <article className="pb-10 pt-8 md:h-[calc(100dvh-120px)] md:overflow-hidden md:pt-8">
      <ViewTransitionLink href="/blog" className="mb-5 block w-fit text-[14px] text-black/65">
        ← Back to blog
      </ViewTransitionLink>

      <div className="grid gap-8 md:h-[calc(100%-44px)] md:grid-cols-[0.42fr_0.58fr] md:gap-6">
        <div className="md:sticky md:top-8 md:self-start">
          <p className="mb-5 text-[13px] text-black/55">
            {post.date} · {post.category}
          </p>
          {/* Shared hero: morphs from the list item title */}
          <h1
            className="max-w-[520px] text-[40px] leading-[1.12] tracking-[-0.065em] md:text-[52px]"
            style={{ viewTransitionName: `post-title-${post.slug}` }}
          >
            {post.title}.
          </h1>
          <p className="mt-7 max-w-[420px] text-[16px] leading-7 text-black/72">
            {post.excerpt}
          </p>
          <FloatingWireframe className="mt-10 h-[200px] -ml-6 mr-8 max-w-[430px]" />
          <div className="mt-11 flex items-center gap-6 text-[13px]">
            <span>Share</span>
            <button type="button">X</button>
            <button type="button">LinkedIn</button>
            <button type="button">Copy link</button>
          </div>
        </div>

        <div className="min-h-0 md:h-full">
          <div
            ref={scrollRef}
            className="post-scroll-pane h-full overflow-y-auto pr-2 pt-1 text-[16px] leading-7 text-black/76 md:pr-4"
          >
            {ArticleBody ? (
              <ArticleBody />
            ) : (
              <p className="text-black/45">Article content coming soon.</p>
            )}
            <div className="flex justify-end pb-4 pt-8 text-[14px]">
              <span className="text-black/55">Next post →</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
