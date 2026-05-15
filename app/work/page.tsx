import { WorkProjectList } from "@/components/work/WorkProjectList";
import { projects } from "@/data/projects";
import { Arrow } from "@/components/ui/Arrow";
import { ViewTransitionLink } from "@/components/motion/ViewTransitionLink";

export default function WorkPage() {
  return (
    <div className="pb-24 pt-14 md:pt-20">
      <div className="grid gap-8 md:grid-cols-[0.6fr_0.4fr]">
        <div>
          <h1 className="text-[52px] tracking-[-0.07em] md:text-[70px]">Selected work.</h1>
          <p className="mt-4 max-w-[330px] text-[15px] leading-6 text-black/70">
            A collection of projects and case studies.
          </p>
        </div>
        <ViewTransitionLink
          href={`/work/${projects[0].slug}`}
          className="group self-start justify-self-start border-b border-black pb-2 text-[14px] md:justify-self-end"
        >
          View featured project <Arrow />
        </ViewTransitionLink>
      </div>
      <WorkProjectList projects={projects} />
    </div>
  );
}
