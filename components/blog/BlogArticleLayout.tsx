import { type Post } from "@/data/posts";
import { FloatingWireframe } from "@/components/canvas/FloatingWireframe";
import { ViewTransitionLink } from "@/components/motion/ViewTransitionLink";
import { getArticleBody } from "@/lib/article-content";

interface BlogArticleLayoutProps {
  post: Post;
}

export function BlogArticleLayout({ post }: BlogArticleLayoutProps) {
  const ArticleBody = getArticleBody(post.slug);

  return (
    <article className="pb-10 pt-10 md:pt-14">
      <ViewTransitionLink
        href="/blog"
        className="mb-9 block text-[14px] text-black/65"
      >
        ← Back to blog
      </ViewTransitionLink>

      <div className="grid gap-12 md:grid-cols-[0.46fr_0.54fr]">
        {/* Left sidebar — sticky */}
        <div className="md:sticky md:top-8 md:self-start">
          <p className="mb-5 text-[13px] text-black/55">
            {post.date} · {post.category}
          </p>
          <h1 className="max-w-[520px] text-[40px] leading-[1.12] tracking-[-0.065em] md:text-[52px]">
            {post.title}.
          </h1>
          <p className="mt-7 max-w-[420px] text-[16px] leading-7 text-black/72">
            {post.excerpt}
          </p>
          <FloatingWireframe className="mt-14 h-[220px] mr-8 max-w-[460px]" />
          {/* Share row — no "Next post" here */}
          <div className="mt-11 flex items-center gap-6 text-[13px]">
            <span>Share</span>
            <button type="button">X</button>
            <button type="button">LinkedIn</button>
            <button type="button">Copy link</button>
          </div>
        </div>

        {/* Right column — fixed height, article scrolls, Next post pinned at bottom */}
        <div className="flex flex-col md:h-[calc(100dvh-220px)]">
          {/* Scrollable body */}
          <div className="post-scroll-pane flex-1 overflow-y-auto pr-2 pt-2 text-[16px] leading-7 text-black/76 md:pr-5">
            {ArticleBody ? (
              <ArticleBody />
            ) : (
              <p className="text-black/45">Article content coming soon.</p>
            )}
          </div>

          {/* Next post — always visible at the foot of the column */}
          <div className="shrink-0 border-t border-black/10 pt-4 text-right text-[14px]">
            <span className="text-black/55">Next post →</span>
          </div>
        </div>
      </div>
    </article>
  );
}
