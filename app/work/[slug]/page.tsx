import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/lib/content";
import { ProjectCaseStudyLayout } from "@/components/work/ProjectCaseStudyLayout";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectCaseStudyLayout project={project} />;
}
