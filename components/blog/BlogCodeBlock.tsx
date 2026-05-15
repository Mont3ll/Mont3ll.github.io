interface BlogCodeBlockProps {
  filename?: string;
  code?: string;
}

export function BlogCodeBlock({
  filename = "boundary.ts",
  code = `type Boundary<Input, Output> = {
  name: string;
  accepts: (value: unknown) => value is Input;
  run: (input: Input) => Promise<Output>;
};

export function createBoundary<Input, Output>(
  boundary: Boundary<Input, Output>
) {
  return async function execute(value: unknown) {
    if (!boundary.accepts(value)) {
      throw new Error(\`Invalid input for \${boundary.name}\`);
    }

    return boundary.run(value);
  };
}`,
}: BlogCodeBlockProps) {
  return (
    <div className="blog-code-block">
      <div className="blog-code-toolbar">
        <div className="blog-code-dots">
          <span />
          <span />
          <span />
        </div>
        <span>{filename}</span>
      </div>
      <pre aria-label="Code example">
        <code>{code}</code>
      </pre>
    </div>
  );
}
