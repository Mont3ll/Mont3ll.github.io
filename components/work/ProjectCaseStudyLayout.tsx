import { type Project } from "@/data/projects";
import { ProjectImage } from "./ProjectImage";
import { ProjectImageGrid } from "./ProjectImageGrid";
import { Meta } from "@/components/ui/Meta";
import { Arrow } from "@/components/ui/Arrow";
import { ViewTransitionLink } from "@/components/motion/ViewTransitionLink";

interface ProjectCaseStudyLayoutProps {
  project: Project;
}

export function ProjectCaseStudyLayout({ project }: ProjectCaseStudyLayoutProps) {
  const imageSrcs = project.images?.map((img) => img.src) ?? [];

  return (
    <div className="pb-24 pt-10 md:pt-14">
      <ViewTransitionLink href="/work" className="mb-9 block text-[14px] text-black/65">
        ← Back to work
      </ViewTransitionLink>
      <div className="grid gap-12 md:grid-cols-[0.34fr_0.66fr]">
        <aside className="md:sticky md:top-8 md:self-start">
          <p className="mb-4 text-[13px] text-black/55">
            {project.number} / {project.type}
          </p>
          <h1 className="text-[42px] tracking-[-0.07em] md:text-[52px]">{project.title}</h1>
          <p className="mt-5 max-w-[360px] text-[15px] leading-6 text-black/70">
            {project.summary}.
          </p>
          <dl className="mt-11 space-y-5 text-[14px]">
            <Meta label="Role" value={project.role} />
            <Meta label="Timeline" value={project.timeline} />
            <Meta label="Stack" value={project.stack.join(", ")} />
          </dl>
          <div className="mt-9 space-y-3 text-[14px]">
            {project.links?.live && project.links.live !== "#" && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex w-fit items-center gap-1 border-b border-black pb-0.5"
              >
                Live site <Arrow />
              </a>
            )}
            {project.links?.source && project.links.source !== "#" && (
              <a
                href={project.links.source}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex w-fit items-center gap-1 border-b border-black pb-0.5"
              >
                Source code <Arrow />
              </a>
            )}
          </div>
        </aside>

        <div className="project-scroll-pane space-y-8 md:max-h-[545px] md:overflow-y-auto md:pr-4">
          <ProjectImage
            title={project.title.split(" ")[0]}
            src={imageSrcs[0] ?? ""}
            caption={
              imageSrcs[0]
                ? "Primary project screenshot."
                : "Fallback editorial layout — add project screenshots to public/images/projects."
            }
          />

          {/* Project description */}
          <div className="border-y border-black/10 py-8 text-[15px] leading-7 text-black/72">
            <p>{project.body}</p>
          </div>

          <ProjectImageGrid images={imageSrcs} />

          <ProjectImage
            title="System"
            src={imageSrcs[3] ?? ""}
            caption={
              imageSrcs[3]
                ? "Architecture or extended project visual."
                : "Fallback architecture visual — replace with a real screenshot or diagram."
            }
            variant="tall"
          />
        </div>
      </div>
    </div>
  );
}
