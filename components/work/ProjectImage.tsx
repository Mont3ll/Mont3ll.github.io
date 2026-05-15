import { cx } from "@/lib/cx";

interface ProjectImageProps {
  title: string;
  caption: string;
  variant?: "wide" | "tall";
  src?: string;
}

export function ProjectImage({
  title,
  caption,
  variant = "wide",
  src = "",
}: ProjectImageProps) {
  return (
    <figure className={cx("project-media-card", variant === "tall" && "is-tall")}>
      <div className="project-media-visual">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="project-detail-image" />
        ) : null}
        <div className="project-media-grid" />
        {!src && (
          <div className="project-media-window">
            <div className="project-media-toolbar">
              <span />
              <span />
              <span />
            </div>
            <div className="project-media-content">
              <div className="project-media-heading">{title.split(" ")[0]}</div>
              <div className="project-media-lines">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="project-media-chart">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
        )}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
