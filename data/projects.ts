export type Project = {
  slug: string;
  number: string;
  title: string;
  summary: string;
  type: string;
  role: string;
  timeline: string;
  stack: string[];
  links?: { live?: string; source?: string };
  previewImage?: string;
  images?: { src: string; caption: string; variant?: "wide" | "tall" }[];
  body: string;
};

export const projects: Project[] = [
  {
    slug: "pi-persistent-intelligence",
    number: "01",
    title: "PI Persistent Intelligence",
    summary: "Open-source AI agent memory package",
    type: "OSS / NPM Package",
    role: "Open-Source Author",
    timeline: "Mar 2026 – Present",
    stack: ["TypeScript", "Node.js", "JSONL", "Bun", "GitHub Actions", "npmjs"],
    links: {
      live: "https://www.npmjs.com/package/@Mont3ll/pi-persistent-intelligence",
      source: "https://github.com/Mont3ll/pi-persistent-intelligence",
    },
    previewImage: "/images/projects/pi-persistent-intelligence/preview.png",
    images: [
      { src: "/images/projects/pi-persistent-intelligence/preview.png", caption: "Memory inbox overlay showing pending items awaiting promotion.", variant: "tall" },
    ],
    body: "An open-source TypeScript package that gives AI coding agents structured, searchable memory across sessions. Organises memory into daily logs, a curated long-term store, and an inbox for promotion decisions. The JSONL format keeps the data portable and diffable. Published to both npmjs.com and GitHub Packages via a dual-registry GitHub Actions workflow. Used to power the PI coding agent context injection in every session.",
  },
  {
    slug: "garagepro",
    number: "02",
    title: "GaragePro",
    summary: "Garage management SaaS platform",
    type: "SaaS / Web App",
    role: "Full Stack Developer",
    timeline: "Oct 2025 – Feb 2026",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Stripe", "NextAuth.js", "Vercel"],
    links: { live: "https://garagepro.co.ke", source: "#" },
    previewImage: "/images/projects/autowerk-saas/preview.png",
    images: [
      { src: "/images/projects/autowerk-saas/preview.png", caption: "Landing page and product overview." },
      { src: "/images/projects/autowerk-saas/job-detail.png", caption: "Job detail view with parts, labour, and status tracking." },
      { src: "/images/projects/autowerk-saas/appointments.png", caption: "Appointment calendar and scheduling interface." },
      { src: "/images/projects/autowerk-saas/inspection.png", caption: "Vehicle inspection summary and sign-off flow.", variant: "tall" },
    ],
    body: "A full-featured SaaS platform for independent garages and auto workshops. GaragePro handles the full job lifecycle: vehicle intake, inspection, job card creation, parts ordering, technician assignment, and invoice generation. Built with a multi-tenant architecture so each garage gets its own data-isolated workspace. Stripe powers subscription billing and customer invoicing.",
  },
  {
    slug: "chapaworks",
    number: "03",
    title: "Chapaworks",
    summary: "Verified artisan services marketplace",
    type: "Marketplace / Web App",
    role: "Full Stack Developer",
    timeline: "Mar 2026 – May 2026",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Cloudinary", "Stripe", "Vercel"],
    links: { live: "#", source: "#" },
    previewImage: "/images/projects/artisanlink/preview.png",
    images: [
      { src: "/images/projects/artisanlink/preview.png", caption: "Admin dashboard with platform metrics and pending actions." },
      { src: "/images/projects/artisanlink/verification.png", caption: "Artisan identity and skill verification workflow." },
      { src: "/images/projects/artisanlink/database.png", caption: "Database management and record inspection interface.", variant: "tall" },
    ],
    body: "A marketplace connecting clients with verified skilled artisans across trades: plumbing, electrical, carpentry, and more. Artisans go through a structured onboarding and verification flow before their profiles go live. The admin panel provides moderation tools, dispute management, and payout oversight. Cloudinary handles portfolio image hosting; Stripe Connect powers split payments to artisan accounts.",
  },
  {
    slug: "timetab",
    number: "04",
    title: "TimeTab",
    summary: "Academic timetable generation system",
    type: "Web App",
    role: "Full Stack Developer",
    timeline: "Jan 2026 – Apr 2026",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma", "Python", "Vercel"],
    links: { live: "#", source: "#" },
    previewImage: "/images/projects/bihc-scheduler/preview.png",
    images: [
      { src: "/images/projects/bihc-scheduler/preview.png", caption: "Dashboard overview with generation status and quick stats." },
      { src: "/images/projects/bihc-scheduler/timetable.png", caption: "Generated timetable view by cohort and day." },
      { src: "/images/projects/bihc-scheduler/generator.png", caption: "Timetable generation configuration and conflict settings." },
      { src: "/images/projects/bihc-scheduler/reports.png", caption: "Lecturer workload and venue utilisation reports.", variant: "tall" },
    ],
    body: "Automated timetable scheduling system built for Baraka International Holistic College. The platform ingests course units, cohort sizes, lecturer availability, and venue capacity, then runs a constraint-satisfaction algorithm to produce conflict-free weekly timetables. Includes a data import pipeline for bulk setup and reporting dashboards for workload analysis and room utilisation.",
  },
  {
    slug: "karibu-kahawa",
    number: "05",
    title: "Karibu Kahawa",
    summary: "Coffee academy and e-commerce platform",
    type: "Web App",
    role: "Full Stack Developer",
    timeline: "Aug 2025 – Sep 2025",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity CMS", "Stripe", "NextAuth.js", "Framer Motion", "Vercel"],
    links: { live: "https://karibukahawacamps.vercel.app/", source: "#" },
    previewImage: "/images/projects/karibu-kahawa/preview.webp",
    images: [
      { src: "/images/projects/karibu-kahawa/preview.webp", caption: "Platform homepage featuring the roastery and course catalogue.", variant: "tall" },
    ],
    body: "A comprehensive platform for a specialty coffee roastery and SCA-certified education centre. Combines e-commerce for freshly roasted beans with an integrated learning management system for barista and brewing certification programmes. Sanity powers the content layer while Stripe handles course enrolment and product purchases seamlessly.",
  },
];
