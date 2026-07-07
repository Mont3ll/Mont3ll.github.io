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
    summary: "Governed memory and session search for AI coding agents",
    type: "OSS / NPM Package",
    role: "Open-source author",
    timeline: "Mar 2026 to Present",
    stack: ["TypeScript", "Node.js", "JSONL", "Bun", "GitHub Actions", "npm"],
    links: {
      live: "https://www.npmjs.com/package/@Mont3ll/pi-persistent-intelligence",
      source: "https://github.com/Mont3ll/pi-persistent-intelligence",
    },
    previewImage: "/images/projects/pi-persistent-intelligence/preview.png",
    images: [
      { src: "/images/projects/pi-persistent-intelligence/preview.png", caption: "Memory inbox overlay for reviewing records before promotion.", variant: "tall" },
    ],
    body: "A TypeScript package that gives PI coding agents durable, searchable memory across sessions. I designed the canonical JSONL record format, daily and long-term memory layers, inbox promotion flow, contested-memory warnings, session search, recall diagnostics, and dual-registry package publishing. The project is relevant to agentic product work because it treats AI memory as governed infrastructure rather than loose notes.",
  },
  {
    slug: "garagepro",
    number: "02",
    title: "GaragePro",
    summary: "Multi-tenant garage and supplier management SaaS",
    type: "SaaS / Web App",
    role: "Full-stack engineer",
    timeline: "Oct 2025 to Feb 2026",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Clerk", "Stripe", "M-Pesa"],
    links: { live: "https://garagepro.co.ke", source: "#" },
    previewImage: "/images/projects/autowerk-saas/preview.png",
    images: [
      { src: "/images/projects/autowerk-saas/preview.png", caption: "Product overview and landing page." },
      { src: "/images/projects/autowerk-saas/job-detail.png", caption: "Job detail view with parts, labour, assigned staff, and status tracking." },
      { src: "/images/projects/autowerk-saas/appointments.png", caption: "Appointment calendar and scheduling interface." },
      { src: "/images/projects/autowerk-saas/inspection.png", caption: "Vehicle inspection summary and sign-off flow.", variant: "tall" },
    ],
    body: "A multi-tenant automotive service SaaS for garages, garage staff, suppliers, supplier staff, customers, and platform admins. I owned the full-stack implementation across tenant-scoped data models, server-side authorization, RBAC flows, job cards, inspections, inventory, supplier marketplace orders, invoicing, payments, reporting, and dashboards. Garage-side records are scoped by garageId, supplier-side records by supplierOrgId, and server actions derive tenant context from the authenticated user instead of trusting client input.",
  },
  {
    slug: "somaai-lms",
    number: "03",
    title: "SomaAI LMS",
    summary: "AI-enabled LMS with analytics and embedded classroom flows",
    type: "LMS / AI Product",
    role: "Full-stack engineer",
    timeline: "2025 to Present",
    stack: ["Next.js", "TypeScript", "Django REST Framework", "PostgreSQL", "Redis", "Celery", "S3", "Garage"],
    links: { live: "#", source: "#" },
    previewImage: "/images/projects/bomaed-lms/preview.webp",
    images: [
      { src: "/images/projects/bomaed-lms/preview.webp", caption: "Learning platform interface with role-based LMS workflows.", variant: "tall" },
    ],
    body: "A multi-role learning platform with learner, instructor, and admin dashboards, course delivery, assessments, progress tracking, certificates, learning paths, analytics, AI content workflows, and an embedded multi-agent classroom flow. I worked on the backend API structure, role-based product flows, analytics-heavy interfaces, S3-compatible file storage, Celery jobs, and OpenMAIC classroom integration. The storage layer uses the S3 API shape, with Garage locally and AWS S3 as the production target, so object storage can move between self-hosted and managed infrastructure without rewriting the file layer.",
  },
  {
    slug: "chapaworks",
    number: "04",
    title: "Chapaworks",
    summary: "Verified artisan services marketplace",
    type: "Marketplace / Web App",
    role: "Full-stack engineer",
    timeline: "Mar 2026 to May 2026",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Clerk", "M-Pesa", "Mapbox"],
    links: { live: "https://chapaworks2.vercel.app", source: "#" },
    previewImage: "/images/projects/artisanlink/preview.png",
    images: [
      { src: "/images/projects/artisanlink/preview.png", caption: "Admin dashboard with marketplace metrics and pending actions." },
      { src: "/images/projects/artisanlink/verification.png", caption: "Artisan identity and skill verification workflow." },
      { src: "/images/projects/artisanlink/database.png", caption: "Database management and record inspection interface.", variant: "tall" },
    ],
    body: "A marketplace connecting clients with verified skilled artisans across trades such as plumbing, electrical work, carpentry, and general home services. I built the core product flows around client accounts, artisan profiles, verification, admin review, location-aware discovery, service requests, messaging, reviews, and payment-oriented workflows. The project shows practical marketplace engineering: trust, onboarding, search, moderation, and role-specific product surfaces.",
  },
  {
    slug: "timetab",
    number: "05",
    title: "TimeTab",
    summary: "Hospitality college timetable and exam scheduler",
    type: "Scheduling / Web App",
    role: "Full-stack engineer",
    timeline: "Jan 2026 to Apr 2026",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma", "Clerk", "Vercel"],
    links: { live: "#", source: "#" },
    previewImage: "/images/projects/bihc-scheduler/preview.png",
    images: [
      { src: "/images/projects/bihc-scheduler/preview.png", caption: "Dashboard overview with generation status and quick stats." },
      { src: "/images/projects/bihc-scheduler/timetable.png", caption: "Generated timetable view by cohort and day." },
      { src: "/images/projects/bihc-scheduler/generator.png", caption: "Timetable generation configuration and conflict settings." },
      { src: "/images/projects/bihc-scheduler/reports.png", caption: "Lecturer workload and venue utilisation reports.", variant: "tall" },
    ],
    body: "A timetable and exam scheduling system built in partnership with Boma International Hospitality College. The system models hospitality-specific venues such as kitchens, bakeries, training restaurants, bars, coffee labs, housekeeping suites, and front-office simulation spaces. I implemented data management, scheduling flows, conflict prevention, cohort splitting, drag-and-drop edits, PDF/CSV/iCal exports, workload reporting, and generation summaries that show where constraints were relaxed.",
  },
];
