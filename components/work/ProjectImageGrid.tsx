import { ProjectImage } from "./ProjectImage";

interface ProjectImageGridProps {
  images?: string[];
}

export function ProjectImageGrid({ images = [] }: ProjectImageGridProps) {
  return (
    <div className="project-media-grid-layout">
      <ProjectImage
        title="Metrics"
        src={images[1] ?? ""}
        caption="Service health, request volume, and latency views."
      />
      <ProjectImage
        title="Flows"
        src={images[2] ?? ""}
        caption="Operational workflows and incident response surfaces."
      />
    </div>
  );
}
