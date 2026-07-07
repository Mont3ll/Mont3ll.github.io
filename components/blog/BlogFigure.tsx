interface BlogFigureProps {
  title: string;
  caption: string;
  src?: string;
}

export function BlogFigure({ title, caption, src = "" }: BlogFigureProps) {
  return (
    <figure className="blog-figure">
      <div className={`blog-figure-visual ${src ? "has-image" : ""}`}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="blog-figure-image" />
        ) : null}
        {!src ? <div className="blog-figure-grid" /> : null}
        {!src ? <div className="blog-figure-label">{title}</div> : null}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
