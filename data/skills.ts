export const skills: Record<string, string[]> = {
  Languages: ["TypeScript", "JavaScript", "Python", "SQL", "Bash"],
  Frontend: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "GSAP"],
  Backend: ["Node.js", "FastAPI", "Django", "PostgreSQL", "Redis"],
  DevOps: ["Docker", "Podman", "NixOS", "Vercel", "GitHub Actions"],
  Tools: ["Sanity CMS", "Stripe", "Prisma", "Cloudinary", "shadcn/ui"],
};

export const skillEffects = [
  "plop",
  "blur",
  "stagger",
  "stretch",
  "flip3d",
  "spread",
  "pull",
  "shift",
  "slide-horizontal",
  "slide-vertical",
  "elevate",
  "split",
  "zip",
  "inflate",
  "pinch",
  "plump",
  "fall",
  "run",
  "bounce",
  "wiggle",
  "glitch",
  "pop",
] as const;

export type SkillEffect = (typeof skillEffects)[number];
