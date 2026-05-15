# mont3ll portfolio

Production Next.js App Router portfolio — migrated from the single-file design preview.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Bun** (package manager + dev server)

## Structure

```
app/            → App Router pages (/, /about, /blog, /blog/[slug], /work, /work/[slug], /skills, /contact)
components/
  layout/       → PageFrame, TopNav, BottomStatus, Logo, MobileMenu, MobileMenuButton
  motion/       → Preloader, MagneticButton, RevealList, SplitText, SplitSkill, RotatingBuildLine
  canvas/       → ParticleWord, PixelCanvas, FloatingWireframe
  blog/         → BlogList, BlogFigure, BlogCodeBlock, BlogArticleLayout
  work/         → WorkProjectList, ProjectImage, ProjectImageGrid, ProjectCaseStudyLayout
  skills/       → PixelInteractionCards (PixelCard + PixelIcon)
  ui/           → Arrow, Dot, Meta, ContactLine
data/           → site.ts, posts.ts, projects.ts, skills.ts
content/        → posts/*.mdx, projects/*.mdx  (reserved for future MDX)
hooks/          → useTheme, usePreloader, useViewTransition, useReducedMotion, useMediaQuery
lib/            → cx, clamp, canvas, content, seo, skillVariant
styles/         → theme, motion, layout, mobile-menu, lists, project, blog, skills, canvas (all imported in globals.css)
public/         → images/, icons/, og/
```

## Getting started

```bash
bun install
bun dev       # → http://localhost:3000
bun build     # production build
bun start     # serve production build
```

## Adding content

- **Projects** → edit `data/projects.ts` and drop images into `public/images/projects/<slug>/`
- **Blog posts** → edit `data/posts.ts`; body content is in `components/blog/BlogArticleLayout.tsx` (swap for MDX later)
- **Skills** → edit `data/skills.ts`

## Image convention

Project and blog images live under `public/images/`. Reference them as `/images/projects/aether-dashboard/hero.jpg`.
