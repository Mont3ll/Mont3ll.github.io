import React from "react";
import { BlogFigure } from "@/components/blog/BlogFigure";
import { BlogCodeBlock } from "@/components/blog/BlogCodeBlock";

const headingClass = "pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black";

function GarageProTenantIsolationRbacReporting() {
  return (
    <>
      <p>
        GaragePro started as a workflow problem, not a dashboard problem. A garage needed one place for customers, vehicles, inspections, job cards, inventory, invoices, payments, suppliers, and reports. The harder part was making that work for more than one garage without leaking data across workspaces.
      </p>
      <p>
        I built the system as a multi-tenant SaaS. Garage records are scoped by <code>garageId</code>. Supplier records are scoped by <code>supplierOrgId</code>. Platform records sit outside both scopes. That separation shaped the schema, the route structure, the server actions, and the dashboard experience.
      </p>
      <BlogFigure
        src="/images/projects/autowerk-saas/preview.png"
        title="GaragePro"
        caption="GaragePro is a multi-tenant automotive service platform with separate garage, supplier, customer, staff, and platform-admin surfaces."
      />
      <h2 className={headingClass}>Tenant context is resolved on the server</h2>
      <p>
        I did not trust the client to tell the backend which tenant it belonged to. Server actions resolve the authenticated user first, then derive the garage or supplier organization from that database record. A garage staff member resolves to a garage workspace. A supplier staff member resolves to a supplier organization. Customer records resolve to the garage that owns the relationship.
      </p>
      <p>
        That tenant context is then added to reads and writes. Customer lists, vehicles, jobs, inspections, invoices, inventory parts, purchase orders, marketplace orders, supplier products, and staff lists all run through the same rule: fetch only the records that belong to the authenticated organization.
      </p>
      <BlogCodeBlock
        filename="tenant-scoped-action.ts"
        code={`const user = await getAuthenticatedUser();

if (!user.isStaff) {
  return { success: false, error: "Unauthorized" };
}

const jobs = await db.job.findMany({
  where: { garageId: user.garageId },
  include: { customer: true, vehicle: true, assignedTechnician: true },
});`}
      />
      <h2 className={headingClass}>Roles had to match how garages actually work</h2>
      <p>
        The role model covers platform admins, garage owners, service advisors, technicians, customers, supplier admins, and supplier staff. Owners manage the garage workspace. Service advisors handle customer and job operations. Technicians work mainly from assigned jobs, inspections, and performance views. Customers see their vehicles, bookings, invoices, and payment status.
      </p>
      <p>
        The supplier side needed its own shape. Supplier admins manage the organization, products, orders, and staff. Supplier staff work with catalog and order operations without getting the same control over organization settings. That mattered because supplier workflows have their own operational rules instead of being a relabeled garage workflow.
      </p>
      <h2 className={headingClass}>The reports were built from operational data</h2>
      <p>
        The reporting layer pulls from live business objects, not a separate demo table. I built reports for monthly revenue, profit and loss, expenses, customer directories, service history, vehicle inventory, maintenance schedules, job completion, inventory status, staff performance, tax summaries, and supplier order activity.
      </p>
      <p>
        Each report had to respect the same tenant and role rules as the rest of the app. A garage owner can review the garage’s financial and operational picture. A technician sees work tied to their role. A customer sees their own invoices and vehicles. A supplier sees supplier-side orders and catalog activity.
      </p>
      <h2 className={headingClass}>What I owned</h2>
      <p>
        I worked across the full stack: schema design, tenant scoping, RBAC checks, server actions, dashboards, report generation, supplier portal flows, customer/staff workflows, frontend screens, performance work, and deployment support. The result is the kind of SaaS work I enjoy most: product screens tied directly to the operational model underneath them.
      </p>
    </>
  );
}

function SomaAiEmbeddedAgenticClassroom() {
  return (
    <>
      <p>
        The LMS project was built around a simple product question: what happens when learning content, learner activity, analytics, and AI interventions live in one system? The answer was not a single chatbot. It was a multi-role platform with learners, instructors, admins, analytics, file storage, recommendations, and an embedded interactive classroom surface.
      </p>
      <p>
        The stack uses a Next.js frontend and a Django REST Framework backend. The backend exposes auth, users, tenants, courses, assessments, enrollments, files, learning paths, skills, notifications, analytics, AI, and OpenMAIC interactive-session APIs. PostgreSQL stores the core records, Redis and Celery handle background work, and storage is wired through an S3-compatible interface.
      </p>
      <BlogFigure
        src="/images/projects/bomaed-lms/preview.webp"
        title="SomaAI"
        caption="The LMS combines role dashboards, analytics, recommendations, file storage, and an embedded multi-agent classroom experience."
      />
      <h2 className={headingClass}>Embedded classroom as a product surface</h2>
      <p>
        The embedded classroom is the part that feels closest to modern embedded analytics and agentic product work. A generated classroom is created by an external multi-agent service, then embedded inside the LMS through a sandboxed iframe. The learner experiences it as part of the course, not as a separate tool.
      </p>
      <p>
        The backend tracks generation status, stores the OpenMAIC classroom ID, and exposes status endpoints. A Celery poller checks the external service until the session is ready. Once it is approved, the learner can open it from the course module. Telemetry from the iframe flows back through <code>postMessage</code>, then into LMS APIs and the analytics pipeline.
      </p>
      <BlogCodeBlock
        filename="embedded-classroom-flow.txt"
        code={`Instructor selects module content
ClassroomGenerationService sends a generation request
OpenMAIC returns jobId, status, and pollUrl
Celery polls until the classroom is ready
Instructor reviews and approves the generated session
Learner opens the classroom inside a sandboxed iframe
Telemetry flows back into analytics`}
      />
      <h2 className={headingClass}>Storage was designed around the S3 API</h2>
      <p>
        File uploads, generated assets, and media storage use <code>django-storages</code> and <code>boto3</code>. Locally, I set up Garage as an S3-compatible object store with bucket credentials, path-style addressing, SigV4 signing, and an endpoint URL. The same code path can point at AWS S3 by changing credentials, bucket, region, and endpoint configuration.
      </p>
      <p>
        That setup was useful because it forced the file layer to depend on the S3 interface instead of a local filesystem assumption. Local development can run against Garage. Production can run against AWS S3. The application storage code does not need to know which one is behind the endpoint.
      </p>
      <h2 className={headingClass}>Analytics and governance</h2>
      <p>
        The LMS analytics layer covers learner progress, activity events, instructor analytics, admin analytics, reports, dashboards, risk views, and intervention review flows. The important detail is that AI suggestions are treated as reviewable product state. Instructors can approve, reject, or regenerate generated classroom material before learners see it.
      </p>
      <p>
        That pattern matters for any customer-facing AI product. The agent can help create or explain, but the system still needs tenant context, role checks, source data, review states, telemetry, and operational controls.
      </p>
    </>
  );
}

function TimeTabHospitalitySchedulingSystem() {
  return (
    <>
      <p>
        TimeTab was built with Boma International Hospitality College to solve a scheduling problem that spreadsheets were not handling well. Hospitality education has a different shape from a standard classroom timetable. A culinary session may need a kitchen. A bakery practical may need a different venue. A restaurant simulation may need specific equipment. Large cohorts sometimes need to be split across rooms.
      </p>
      <p>
        The system manages programs, course units, lecturers, venues, cohorts, timetable generation, exam scheduling, exports, and reporting. It turns course requirements, cohort sizes, lecturer availability, venue types, and operating hours into weekly timetables that can be reviewed and adjusted.
      </p>
      <BlogFigure
        src="/images/projects/bihc-scheduler/preview.png"
        title="TimeTab"
        caption="TimeTab was designed with Boma International Hospitality College for timetable and exam scheduling in hospitality education."
      />
      <h2 className={headingClass}>The scheduling problem was constraint-heavy</h2>
      <p>
        The generator prevents three common conflicts: the same venue booked twice, the same lecturer assigned to two sessions, and the same cohort placed in two sessions at the same time. It also understands venue categories such as classroom, kitchen, training restaurant, bar, coffee lab, bakery, computer lab, housekeeping suite, and front-office simulation.
      </p>
      <p>
        Some sessions can pause and resume around breaks. Others, such as kitchen practicals, need to run continuously. TimeTab lets courses define that behavior so the generator does not apply one generic rule to every class.
      </p>
      <h2 className={headingClass}>The generator degrades gracefully</h2>
      <p>
        The first pass tries ideal assignments: assigned lecturer, exact venue type, and no conflicts. If that fails, the system can use compatible venue types or approved substitutes. If one room is too small for a cohort, it can split the cohort across venues or time slots. Anything still unresolved is flagged for manual review with a conflict summary.
      </p>
      <p>
        That approach made the product more useful than a black-box scheduler. Administrators can see why a timetable was generated the way it was, where constraints were relaxed, and what still needs human judgment.
      </p>
      <h2 className={headingClass}>Outputs mattered as much as generation</h2>
      <p>
        The platform includes grid views, cohort views, lecturer views, venue views, PDF exports, CSV exports, iCal exports, analytics dashboards, audit trail records, and drag-and-drop timetable editing. A schedule is only useful if people can read it, share it, correct it, and trust it.
      </p>
      <p>
        My work covered the product structure, scheduling flows, data model, UI screens, exports, conflict handling, and reporting. It is a good example of the kind of product engineering I like: specific domain rules, real users, and a system that has to make hard operational work easier.
      </p>
    </>
  );
}

function BuildingAiAgentMemory() {
  return (
    <>
      <p>
        Most coding agents are useful for one session and forgetful the next morning. I built pi-persistent-intelligence because that failure mode kept showing up in real work. The agent could read the repo, make a plan, fix a bug, and then lose the reasoning that made the fix safe.
      </p>
      <p>
        The package stores memory as canonical JSONL. Daily records capture what happened in the session. Long-term records hold stable rules and project facts. Inbox candidates wait for review before they become durable memory. That review step matters because agent memory should not silently become policy.
      </p>
      <BlogFigure
        src="/images/blog/building-ai-agent-memory.png"
        title="Agent memory"
        caption="pi-persistent-intelligence gives coding agents searchable memory, reviewable promotion, and source-aware recall across sessions."
      />
      <h2 className={headingClass}>The storage format is boring on purpose</h2>
      <p>
        JSONL is easy to diff, easy to back up, easy to inspect, and easy to migrate. I avoided a database as the source of truth because memory records need to be portable and reviewable. A rendered markdown view can help a human read the data, but the JSONL remains canonical.
      </p>
      <h2 className={headingClass}>Governance is the feature</h2>
      <p>
        The package handles evidence records, contested memories, tombstones, session search, recall diagnostics, and patch-governed updates. It treats memory as operational infrastructure, not a pile of notes. That is the difference between an agent that repeats the same mistake and an agent that can be corrected safely.
      </p>
    </>
  );
}

function TheLlmWikiVault() {
  return (
    <>
      <p>
        The LLM Wiki vault is my answer to a specific risk: if an agent writes summaries into the same place as raw sources, the knowledge base slowly becomes untrustworthy. The source layer has to stay immutable. The wiki layer can evolve, but every factual claim needs a link back to an ingested source.
      </p>
      <p>
        The vault separates raw sources, wiki pages, indexes, logs, tags, journal entries, and presentation artifacts. The agent can update concept pages, entity pages, comparisons, and MOCs, but it cannot rewrite the source body. That boundary keeps the system useful.
      </p>
      <BlogFigure
        src="/images/blog/the-llm-wiki-vault.png"
        title="LLM Wiki"
        caption="The vault separates immutable sources from agent-maintained synthesis, with citation rules and bidirectional backlinks."
      />
      <h2 className={headingClass}>Provenance beats polish</h2>
      <p>
        The strongest rule is simple: if a claim would make a reader ask "says who?", it needs a source link. The vault also tracks secondhand sources, unread stubs, bidirectional backlinks, contradiction events, and index updates. The prose can be plain. The provenance cannot be vague.
      </p>
      <h2 className={headingClass}>Why this matters for AI products</h2>
      <p>
        Agentic systems need trusted context. Whether the surface is a research wiki, analytics chat, or a coding assistant, the same questions come up: where did this answer come from, what is it allowed to see, what changed, and how do we correct it when it is wrong?
      </p>
    </>
  );
}

function PublishingDualRegistryNpm() {
  return (
    <>
      <p>
        Publishing to npm and GitHub Packages sounds like one workflow until you do it. They are separate registries, with separate authentication, package names, scopes, and failure modes. I built a release flow that publishes the same TypeScript package to both without treating one registry as a mirror of the other.
      </p>
      <p>
        The workflow builds, typechecks, tests, and publishes from a release tag. npm uses npm-side publishing credentials or trusted publishing. GitHub Packages uses the GitHub package registry and its own token path. The important thing is that a successful npm publish does not imply a successful GitHub Packages publish.
      </p>
      <BlogFigure
        src="/images/blog/publishing-dual-registry-npm.png"
        title="Dual publish"
        caption="The release flow treats npmjs.com and GitHub Packages as separate registries with separate auth and verification."
      />
      <BlogCodeBlock
        filename="release-checks.txt"
        code={`bun test
bun run typecheck
npm publish to npmjs.com
npm publish to npm.pkg.github.com
verify both package pages after release`}
      />
    </>
  );
}

function SwitchingToPiCodingAgent() {
  return (
    <>
      <p>
        I moved more of my development workflow into PI because I wanted the agent close to the terminal, the filesystem, and the history of the project. A chat window can help with isolated questions. A coding agent becomes more useful when it can read files, run commands, edit code, remember corrections, and search past sessions.
      </p>
      <p>
        The main change was not speed. It was continuity. Long projects need decisions, constraints, failed attempts, and operating rules to survive across sessions. Once that context is available, the agent stops asking the same questions and starts behaving more like a project-aware assistant.
      </p>
      <BlogFigure
        src="/images/blog/switching-to-pi-coding-agent.png"
        title="PI workflow"
        caption="PI became the place where coding, memory, search, and project context meet in one terminal-native workflow."
      />
    </>
  );
}

function DockerToPodman() {
  return (
    <>
      <p>
        Docker was my default container tool for years. It worked, every tutorial assumed it, and every deployment conversation started there. I moved to Podman after my local infrastructure became more container-heavy and I wanted a setup that fit better with NixOS and rootless development.
      </p>
      <p>
        The biggest difference is the daemon. Docker depends on a background process. Podman runs containers as child processes of the user who launched them. That model fits cleanly with systemd and makes rootless containers the normal path instead of a special mode.
      </p>
      <BlogFigure
        src="/images/blog/docker-to-podman.webp"
        title="Podman"
        caption="Rootless containers and systemd integration made Podman a better fit for my daily development environment."
      />
      <BlogCodeBlock
        filename="containers.nix"
        code={`virtualisation.podman = {
  enable = true;
  dockerCompat = true;
  defaultNetwork.settings.dns_enabled = true;
};`}
      />
    </>
  );
}

function MultilingualNextjsI18n() {
  return (
    <>
      <p>
        I built a multilingual corporate site without adding a heavy i18n framework. The site needed locale-aware routes, dictionaries, metadata, and content fallbacks. Next.js App Router already had enough primitives for that if the boundaries stayed simple.
      </p>
      <p>
        Middleware reads the locale from the URL or request headers, then routes the user into a locale segment. Server components load the right dictionary for the route. The result is easy to reason about: URLs carry the locale, dictionaries hold the copy, and components receive plain strings.
      </p>
      <BlogFigure
        src="/images/blog/multilingual-nextjs-i18n.jpg"
        title="i18n"
        caption="The implementation used App Router segments, middleware, and dictionaries instead of a large translation dependency."
      />
    </>
  );
}

function FromWslToNixos() {
  return (
    <>
      <p>
        WSL was good enough for a long time. The problem was drift. After months of package installs, config edits, one-off fixes, and version changes, I could not recreate the same machine cleanly. NixOS solved that problem by making the system state explicit.
      </p>
      <p>
        My editor, shell, fonts, container tools, language runtimes, database clients, services, and system settings live in configuration files. A rebuild applies the declared state. A rollback returns to the previous generation. It is slower to learn than a standard distro, but the payoff is a machine I can explain and reproduce.
      </p>
      <BlogFigure
        src="/images/blog/from-wsl-to-nixos.webp"
        title="NixOS"
        caption="NixOS moved my development environment from accumulated state to declared state."
      />
    </>
  );
}

const registry: Record<string, () => React.JSX.Element> = {
  "garagepro-tenant-isolation-rbac-reporting": GarageProTenantIsolationRbacReporting,
  "somaai-embedded-agentic-classroom": SomaAiEmbeddedAgenticClassroom,
  "timetab-hospitality-scheduling-system": TimeTabHospitalitySchedulingSystem,
  "building-ai-agent-memory": BuildingAiAgentMemory,
  "the-llm-wiki-vault": TheLlmWikiVault,
  "publishing-dual-registry-npm": PublishingDualRegistryNpm,
  "switching-to-pi-coding-agent": SwitchingToPiCodingAgent,
  "docker-to-podman": DockerToPodman,
  "multilingual-nextjs-i18n": MultilingualNextjsI18n,
  "from-wsl-to-nixos": FromWslToNixos,
};

export function getArticleBody(slug: string): (() => React.JSX.Element) | null {
  return registry[slug] ?? null;
}
