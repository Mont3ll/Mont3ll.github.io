export type Post = {
  slug: string;
  date: string;
  title: string;
  category: string;
  excerpt: string;
  coverImage?: string;
};

export const posts: Post[] = [
  {
    slug: "garagepro-tenant-isolation-rbac-reporting",
    date: "Jul 07, 2026",
    title: "How I built tenant isolation and reporting in GaragePro",
    category: "SaaS / Architecture",
    excerpt:
      "A technical case study on GaragePro: tenant-scoped data, supplier and garage roles, server-side authorization, dashboards, and reports for an automotive service SaaS.",
    coverImage: "/images/projects/autowerk-saas/preview.png",
  },
  {
    slug: "somaai-embedded-agentic-classroom",
    date: "Jul 07, 2026",
    title: "Embedding a multi-agent classroom inside an LMS",
    category: "AI / Product",
    excerpt:
      "How the LMS connects course content, analytics, S3-compatible storage, async jobs, instructor review, and an embedded multi-agent classroom surface.",
    coverImage: "/images/projects/bomaed-lms/preview.webp",
  },
  {
    slug: "timetab-hospitality-scheduling-system",
    date: "Jul 07, 2026",
    title: "Designing TimeTab for a hospitality college",
    category: "Product / Scheduling",
    excerpt:
      "A case study on the timetable and exam scheduling system built with Boma International Hospitality College, including venue constraints, cohort splits, conflict checks, and exports.",
    coverImage: "/images/projects/bihc-scheduler/preview.png",
  },
  {
    slug: "building-ai-agent-memory",
    date: "May 10, 2026",
    title: "Building persistent memory for AI coding agents",
    category: "AI / Tooling",
    excerpt:
      "How I designed pi-persistent-intelligence: JSONL records, governed promotion, session search, evidence trails, and memory that survives beyond one terminal session.",
    coverImage: "/images/blog/building-ai-agent-memory.png",
  },
  {
    slug: "the-llm-wiki-vault",
    date: "May 08, 2026",
    title: "Building a research wiki where sources stay immutable",
    category: "AI / Research",
    excerpt:
      "An Obsidian vault where an agent can maintain source-backed notes without corrupting the raw source layer. The hard part is provenance, not markdown.",
    coverImage: "/images/blog/the-llm-wiki-vault.png",
  },
  {
    slug: "publishing-dual-registry-npm",
    date: "May 12, 2026",
    title: "Publishing one package to npm and GitHub Packages",
    category: "Engineering",
    excerpt:
      "The small CI details that matter when one TypeScript package has to publish cleanly to npmjs.com and GitHub Packages from the same release tag.",
    coverImage: "/images/blog/publishing-dual-registry-npm.png",
  },
  {
    slug: "switching-to-pi-coding-agent",
    date: "May 06, 2026",
    title: "Why I moved my AI workflow into PI",
    category: "DX",
    excerpt:
      "What changed when I stopped treating AI as a chat window and started treating it as a terminal-native development environment with memory and tools.",
    coverImage: "/images/blog/switching-to-pi-coding-agent.png",
  },
  {
    slug: "docker-to-podman",
    date: "Mar 23, 2025",
    title: "Why I switched from Docker to Podman",
    category: "DevOps",
    excerpt:
      "What I gained from rootless containers, systemd integration, and a local setup that fits better with NixOS and reproducible development.",
    coverImage: "/images/blog/docker-to-podman.webp",
  },
  {
    slug: "multilingual-nextjs-i18n",
    date: "May 10, 2025",
    title: "Multilingual Next.js with App Router i18n",
    category: "Frontend",
    excerpt:
      "A practical App Router i18n setup using middleware, route segments, dictionaries, and static content without adding a heavy translation framework.",
    coverImage: "/images/blog/multilingual-nextjs-i18n.jpg",
  },
  {
    slug: "from-wsl-to-nixos",
    date: "Feb 06, 2025",
    title: "From WSL to NixOS for daily development",
    category: "Systems",
    excerpt:
      "Why I moved from a working WSL setup to a declarative Linux machine, and what actually improved once the novelty wore off.",
    coverImage: "/images/blog/from-wsl-to-nixos.webp",
  },
];
