import { posts, type Post } from "@/data/posts";
import { projects, type Project } from "@/data/projects";

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllPosts(): Post[] {
  return posts;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjects(): Project[] {
  return projects;
}
