export type Post = {
  slug: string;
  date: string;
  title: string;
  category: string;
  excerpt: string;
  coverImage?: string;
};

export const posts: Post[] = [
  // ── Most recent PI/LLM series (2026) ─────────────────────────────────────
  {
    slug: "building-ai-agent-memory",
    date: "May 10, 2026",
    title: "Building a persistent memory system for AI agents",
    category: "AI / Tooling",
    excerpt:
      "How I designed the JSONL-based memory architecture behind pi-persistent-intelligence: daily logs, long-term promotion, and a governed inbox for AI coding agents.",
    coverImage: "/images/blog/building-ai-agent-memory.png",
  },
  {
    slug: "publishing-dual-registry-npm",
    date: "May 12, 2026",
    title: "Publishing an npm package to two registries at once",
    category: "Engineering",
    excerpt:
      "npmjs.com and GitHub Packages are separate registries with separate auth. Here is the GitHub Actions workflow that publishes to both in a single pipeline without duplication.",
    coverImage: "/images/blog/publishing-dual-registry-npm.png",
  },
  {
    slug: "the-llm-wiki-vault",
    date: "May 08, 2026",
    title: "Building a research wiki where sources stay immutable",
    category: "AI / Research",
    excerpt:
      "An Obsidian vault where an LLM agent maintains a living wiki on top of raw, immutable sources. How the schema works and why provenance chains matter.",
    coverImage: "/images/blog/the-llm-wiki-vault.png",
  },
  {
    slug: "switching-to-pi-coding-agent",
    date: "May 06, 2026",
    title: "Switching my entire dev workflow to PI",
    category: "DX",
    excerpt:
      "Why I moved from ad-hoc AI assistance to a persistent coding agent that remembers context across sessions, manages its own memory, and stays in the terminal.",
    coverImage: "/images/blog/switching-to-pi-coding-agent.png",
  },
  // ── Earlier articles ──────────────────────────────────────────────────────
  {
    slug: "docker-to-podman",
    date: "Mar 23, 2025",
    title: "Why I switched from Docker to Podman",
    category: "DevOps",
    excerpt:
      "Docker dominated the container space for years, but Podman's daemonless, rootless architecture offers a fundamentally more secure approach. Here's why I made the switch.",
    coverImage: "/images/blog/docker-to-podman.webp",
  },
  {
    slug: "multilingual-nextjs-i18n",
    date: "May 10, 2025",
    title: "Multilingual Next.js with App Router i18n",
    category: "Frontend",
    excerpt:
      "Next.js App Router makes middleware-based i18n routing elegant. Here's the architecture I used to build a trilingual corporate site with no third-party i18n library.",
    coverImage: "/images/blog/multilingual-nextjs-i18n.jpg",
  },
  {
    slug: "from-wsl-to-nixos",
    date: "Feb 06, 2025",
    title: "From WSL to NixOS — a declarative dev environment",
    category: "Systems",
    excerpt:
      "After years on WSL, I moved to NixOS for its reproducible, declarative approach to system configuration. It changed how I think about infrastructure entirely.",
    coverImage: "/images/blog/from-wsl-to-nixos.webp",
  },
  {
    slug: "startup-sales-lessons",
    date: "Mar 03, 2025",
    title: "What startups get wrong about sales",
    category: "Business",
    excerpt:
      "Key insights from a Brewster Barclay webinar on why most technical founders build before they validate and how to find market needs before writing a single line of code.",
    coverImage: "/images/blog/startup-sales-lessons.webp",
  },
  {
    slug: "building-full-stack-lms",
    date: "Jul 20, 2024",
    title: "Building a production LMS with Next.js",
    category: "Engineering",
    excerpt:
      "How I designed and shipped BomaEd: a full-stack learning management system with video streaming, Stripe payments, and role-based access, from zero to deployed.",
    coverImage: "/images/blog/building-full-stack-lms.webp",
  },
];
