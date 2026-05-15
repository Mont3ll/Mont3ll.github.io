import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/content";
import { BlogArticleLayout } from "@/components/blog/BlogArticleLayout";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return <BlogArticleLayout post={post} />;
}
