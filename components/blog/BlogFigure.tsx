interface BlogFigureProps {
  title: string;
  caption: string;
  src?: string;
}

export function BlogFigure({ title, caption, src = "" }: BlogFigureProps) {
  return (
    <figure className="blog-figure">
      <div className="blog-figure-visual">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="project-detail-image" />
        ) : null}
        <div className="blog-figure-grid" />
        <div className="blog-figure-label">{title}</div>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
