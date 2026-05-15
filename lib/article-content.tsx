import React from "react";
import { BlogFigure } from "@/components/blog/BlogFigure";
import { BlogCodeBlock } from "@/components/blog/BlogCodeBlock";

// ──────────────────────────────────────────────────────────────────────────────
// Article bodies — one component per post slug.
// ──────────────────────────────────────────────────────────────────────────────

function DockerToPodman() {
  return (
    <>
      <p>
        Docker revolutionised how we think about application deployment. For years it was
        my default tool: reliable, well-documented, and universally supported. But as my
        infrastructure needs grew, so did the friction of its daemon-based architecture.
      </p>
      <p>
        The core issue: Docker requires a root-privileged daemon process running continuously
        in the background. That single point of failure (and the security surface it creates)
        started to feel like unnecessary baggage, especially on NixOS where I want full
        declarative control over every running process.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        The daemonless difference
      </h2>
      <p>
        Podman is OCI-compliant and Docker-compatible; most commands are drop-in replacements.
        It runs each container as a direct child process of the user invoking it. No daemon,
        no root requirement by default. Containers die with the terminal session that launched them,
        which turns out to match how I actually think about local development.
      </p>
      <BlogFigure
        title="Container Model"
        caption="Podman's fork/exec model vs Docker's client–daemon–containerd chain. Fewer moving parts, smaller attack surface."
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Migration in practice
      </h2>
      <p>
        The migration was largely painless. I aliased <code>docker</code> to{" "}
        <code>podman</code> for the transition period and ran my existing Compose files with{" "}
        <code>podman-compose</code>. The two places that required real thought were systemd
        socket activation for rootless containers and the way Podman handles network
        namespaces differently from Docker on Linux.
      </p>
      <BlogCodeBlock
        filename="containers.nix"
        code={`# NixOS — declarative Podman setup
{ config, pkgs, ... }:
{
  virtualisation.podman = {
    enable = true;
    dockerCompat = true;   # alias docker → podman
    defaultNetwork.settings.dns_enabled = true;
  };

  users.users.mel.extraGroups = [ "podman" ];
}`}
      />
      <p>
        Twelve months on, I haven&apos;t missed the Docker daemon once. Rootless containers,
        better systemd integration, and the ability to run Podman inside a NixOS module
        declaratively. It fits the workflow perfectly.
      </p>
    </>
  );
}

function FromWslToNixos() {
  return (
    <>
      <p>
        For a long time, WSL was my compromise: Windows for applications, Linux for
        development. It worked well enough, until it didn&apos;t. Window management,
        USB device passthrough, and the overhead of maintaining two separate environments
        started adding up.
      </p>
      <p>
        When I decided to go full Linux, I spent two weeks evaluating options: Ubuntu for
        familiarity, Arch for control, Fedora as a middle ground. I landed on NixOS for
        a reason none of the others could offer: the entire operating system is a function.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Declarative everything
      </h2>
      <p>
        On NixOS, your machine state lives in <code>/etc/nixos/configuration.nix</code>.
        Packages, services, users, fonts, and environment variables, all expressed as Nix
        expressions. Rebuild the system, get an exact replica. Roll back to any previous
        generation with one command.
      </p>
      <BlogFigure
        title="System Config"
        caption="The same configuration.nix that sets up the Podman daemon, installs my editor plugins, and configures the network stack."
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        The development environment
      </h2>
      <BlogCodeBlock
        filename="configuration.nix (excerpt)"
        code={`{ config, pkgs, ... }:
{
  environment.systemPackages = with pkgs; [
    nodejs_22  bun  python312  go
    git  gh  ripgrep  fzf
    vscode  zed-editor
  ];

  programs.zsh.enable = true;
  users.defaultUserShell = pkgs.zsh;

  services.openssh.enable = true;
  networking.firewall.allowedTCPPorts = [ 3000 8000 ];
}`}
      />
      <p>
        The steepest part of the learning curve is the Nix language itself: lazy,
        functional, and unlike anything in the standard sysadmin toolkit. But the
        payoff is a development machine that is version-controlled, reproducible, and
        never subject to configuration drift.
      </p>
    </>
  );
}

function BuildingFullStackLms() {
  return (
    <>
      <p>
        BomaEd started as a simple brief: an online platform where educators could publish
        courses and students could enrol, pay, and track progress. By the time it shipped,
        it had grown into a multi-role system with video streaming, Stripe webhooks, and a
        full certification flow.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Choosing the stack
      </h2>
      <p>
        Next.js App Router was an obvious pick for the frontend, since server components let me
        render the course catalogue and student dashboards without client-side data fetching
        overhead. Prisma over PostgreSQL handled the data layer. The trickier decision was
        Uploadthing for video storage: it abstracts S3 with a typed API that integrates
        cleanly with Next.js route handlers.
      </p>
      <BlogCodeBlock
        filename="schema.prisma (excerpt)"
        code={`model Course {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  price       Float
  published   Boolean  @default(false)
  chapters    Chapter[]
  enrollments Enrollment[]
  createdAt   DateTime @default(now())
}

model Enrollment {
  id        String   @id @default(cuid())
  userId    String
  courseId  String
  paidAt    DateTime @default(now())
  progress  Int      @default(0)
  course    Course   @relation(fields: [courseId], references: [id])
}`}
      />
      <BlogFigure
        title="Course Flow"
        caption="The publish → enrol → watch → certify pipeline. Each state transition triggers a Stripe event or a Prisma write."
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Payments and webhooks
      </h2>
      <p>
        Stripe Checkout handles course purchases. The webhook endpoint verifies the signature,
        creates an <code>Enrollment</code> record, and emails the student a confirmation via
        Resend. The entire flow is idempotent. Replaying a webhook event never double-enrolls
        a student. That single constraint informed most of the payment architecture decisions.
      </p>
    </>
  );
}

function MultilingualNextjsI18n() {
  return (
    <>
      <p>
        When Elitemetrix Solutions needed to serve English, Swahili, and French audiences
        from a single Next.js deployment, I reached for Next.js App Router&apos;s built-in
        i18n primitives rather than a third-party library. The result: locale routing with
        zero runtime i18n overhead.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Middleware-based locale detection
      </h2>
      <p>
        A single middleware file intercepts every request, negotiates the preferred locale
        from the <code>Accept-Language</code> header and stored cookies, and rewrites the
        URL to the appropriate locale segment (<code>/en</code>, <code>/sw</code>,{" "}
        <code>/fr</code>). No client-side re-renders, no hydration mismatch.
      </p>
      <BlogCodeBlock
        filename="middleware.ts"
        code={`import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "sw", "fr"];
const defaultLocale = "en";

function getLocale(request: NextRequest): string {
  const headers = { "accept-language": request.headers.get("accept-language") ?? "" };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(l => pathname.startsWith(\`/\${l}/\`) || pathname === \`/\${l}\`);
  if (hasLocale) return;
  const locale = getLocale(request);
  return NextResponse.redirect(new URL(\`/\${locale}\${pathname}\`, request.url));
}`}
      />
      <BlogFigure
        title="Locale Routing"
        caption="Request → middleware locale negotiation → locale-prefixed route. Dictionary files drive all copy; no client bundle for i18n logic."
      />
      <p>
        Each locale has a typed dictionary object imported server-side. Pages receive the
        dictionary as a prop from a server component, making translated copy available at
        render time with no additional API calls or client-side state.
      </p>
    </>
  );
}

function StartupSalesLessons() {
  return (
    <>
      <p>
        I attended a virtual webinar hosted by JHUB Africa and gDIH, featuring Brewster
        Barclay, AWS Partner Manager and startup mentor with decades of experience across
        East Africa and Europe. The session was ostensibly about writing project proposals.
        What it turned into was a rigorous critique of how technical founders think about
        sales.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Build after you validate, not before
      </h2>
      <p>
        The most common failure mode Brewster described: founders spend six months building
        a product, launch it, and discover there are twelve users who want it. The fix is
        uncomfortable for engineers: talk to potential customers before writing code. Not
        to validate assumptions, but to dissolve them.
      </p>
      <BlogFigure
        title="Market Discovery"
        caption="Genuine conversations surface pain points no survey or desk research can find. The best product insights arrive before the first commit."
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Find the underserved segment
      </h2>
      <p>
        Even saturated markets contain niches with unmet needs. The question is not
        &ldquo;is this market competitive?&rdquo; It is more useful to ask: &ldquo;who is being left out
        by the current solutions, and why?&rdquo; That second question consistently leads to
        better positioning than any feature comparison.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Sales is day-one work
      </h2>
      <p>
        The advice that stuck: treat your first ten customers as co-founders. Their friction
        is your roadmap. Their language is your marketing copy. The founders who scale are
        the ones who stay close to customers long after they could reasonably hand that off
        to someone else.
      </p>
      <blockquote className="border-l border-black/20 pl-7 text-[26px] leading-tight tracking-[-0.05em] text-black">
        &ldquo;If you can&apos;t sell it, you can&apos;t build it. Validation comes before
        engineering.&rdquo;
      </blockquote>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Registry — maps slug → body component
// ──────────────────────────────────────────────────────────────────────────────

function BuildingAiAgentMemory() {
  return (
    <>
      <p>
        Every AI coding session starts fresh. The model has no memory of the last conversation,
        the decisions already made, or the context built up over weeks of work. That statelesness
        is fine for one-off tasks. It becomes a real cost when you are working on the same codebase
        across dozens of sessions.
      </p>
      <p>
        pi-persistent-intelligence solves this with a structured, file-based memory store that the
        agent reads at the start of every session and writes to throughout. No database, no API, just
        JSONL files that are version-controlled alongside the project.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Three layers of memory
      </h2>
      <p>
        The system uses three stores. The <strong>daily log</strong> is append-only and captures
        everything that happens in a session: decisions, changes, open questions. The{" "}
        <strong>long-term store</strong> holds curated, high-confidence facts about the project,
        team preferences, and recurring patterns. The <strong>inbox</strong> is the promotion
        gate: items promoted from daily logs sit here until a human or the agent reviews and
        either archives or elevates them to long-term.
      </p>
      <BlogFigure
        title="Memory Layers"
        caption="Daily log captures everything. Long-term holds what matters. The inbox governs promotion between the two."
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Why JSONL
      </h2>
      <p>
        JSONL (newline-delimited JSON) means every memory entry is one line. Git diffs are
        readable. Appending is an atomic write. Parsing is trivial. The format can be read
        by any tool, fed into any LLM, and audited by a human in a text editor. It is the
        least-magic possible format for something that needs to be trusted.
      </p>
      <BlogCodeBlock
        filename="memory entry (JSONL)"
        code={`{ "id": "mem_20260512_a1b2", "target": "long_term", "confidence": 0.92,
  "content": "Always prefer bun over npm for package management.",
  "tags": ["tooling", "workflow"], "created": "2026-05-12T10:23:00Z" }`}
      />
      <p>
        The TypeScript SDK exposes typed read, write, and search operations. A companion
        PI skill file tells the agent when and how to use the memory store during a session.
      </p>
    </>
  );
}

function TheLlmWikiVault() {
  return (
    <>
      <p>
        Most note-taking systems fail the same way: the notes accumulate but the knowledge
        does not compound. You end up with a pile of text that is hard to search and impossible
        to reason across. The LLM wiki vault is an attempt to fix that by separating two things
        that are usually conflated: <em>sources</em> and <em>synthesis</em>.
      </p>
      <p>
        Raw sources (papers, articles, videos, documentation) live in one folder and are
        strictly immutable after ingestion. The wiki layer (entity pages, concept pages,
        comparisons, MOCs) is built and maintained by an LLM agent on top of those sources,
        with every factual claim linked back to a source file.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Why immutable sources matter
      </h2>
      <p>
        When a model writes a wiki page, it can only cite sources that have been ingested.
        If it cannot find a source, it creates a stub rather than confabulating a citation.
        This single rule eliminates the most dangerous failure mode of LLM-written notes:
        convincing-sounding claims that have no actual backing.
      </p>
      <BlogFigure
        title="Wiki Schema"
        caption="Sources are ingested once and never modified. The wiki layer cites them. The agent maintains provenance chains so secondhand claims are always traceable."
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        The agent as librarian
      </h2>
      <p>
        The AGENTS.md file in the vault root is the schema contract. It tells the agent
        exactly which folders are writable, which templates to follow, how to create
        bidirectional backlinks, and when to propose rather than act. The vault compounds
        over time. Each new source is integrated into the existing wiki, updating entity
        pages, creating new concept pages, and flagging contradictions for human review.
      </p>
    </>
  );
}

function PublishingDualRegistryNpm() {
  return (
    <>
      <p>
        When I published pi-persistent-intelligence, I wanted it available on both npmjs.com
        (the public default registry) and GitHub Packages (for projects that authenticate via
        GitHub tokens). The two registries look similar but are completely separate systems
        with separate authentication, separate package namespaces, and separate publishing flows.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        The workflow structure
      </h2>
      <p>
        A single <code>publish.yml</code> GitHub Actions workflow handles both. It runs on
        version tags, builds the package once, and then publishes to each registry in separate
        steps with different <code>.npmrc</code> configurations. The key is that each publish
        step sets the registry URL and auth token independently.
      </p>
      <BlogCodeBlock
        filename=".github/workflows/publish.yml (core steps)"
        code={`- name: Publish to npmjs
  run: npm publish --access public
  env:
    NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}
  # .npmrc: registry=https://registry.npmjs.org/

- name: Publish to GitHub Packages
  run: npm publish --access public
  env:
    NODE_AUTH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
  # .npmrc: registry=https://npm.pkg.github.com/`}
      />
      <BlogFigure
        title="Dual Registry"
        caption="One build, two publish steps. The only difference is the registry URL and auth token. The tarball is the same artifact in both places."
      />
      <p>
        One detail that trips up most people: the GitHub Packages registry requires the
        package name to be scoped under your GitHub username (<code>@mont3ll/package-name</code>),
        and the scope must match your GitHub account exactly. An unscoped package or a mismatched
        scope will fail authentication silently at publish time.
      </p>
    </>
  );
}

function SwitchingToPiCodingAgent() {
  return (
    <>
      <p>
        I used to start every AI coding session by pasting context: what the project was, what had
        been done, what the current problem was. It worked, but it was overhead, and the context
        was always incomplete. Small decisions from last week were forgotten. Preferences had to be
        re-stated. The model felt like a capable contractor who showed up on day one every day.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        What PI does differently
      </h2>
      <p>
        PI (the coding agent) reads from a structured memory store at the start of each session.
        It knows the project history, the tech stack preferences, the open questions, and the
        decisions already made. It writes back to that store during the session. Over time, the
        context gets richer, not staler.
      </p>
      <BlogFigure
        title="Session Continuity"
        caption="Each session starts with injected long-term context. Each session ends with new daily log entries. The system compounds."
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Staying in the terminal
      </h2>
      <p>
        PI runs as a TUI in the terminal. No browser tab, no Electron app, no context switching.
        The agent and the code editor share the same screen. For keyboard-driven workflows, this
        changes the texture of the work: the conversation with the model feels closer to thinking
        than to typing into a chat interface.
      </p>
      <p>
        The biggest shift was not the capability improvement. It was the trust. When an agent
        remembers what you decided and why, you stop second-guessing whether it has enough context
        to give reliable advice. That trust is what makes the whole system worth the setup cost.
      </p>
    </>
  );
}

const registry: Record<string, () => React.JSX.Element> = {
  "docker-to-podman": DockerToPodman,
  "from-wsl-to-nixos": FromWslToNixos,
  "building-full-stack-lms": BuildingFullStackLms,
  "multilingual-nextjs-i18n": MultilingualNextjsI18n,
  "startup-sales-lessons": StartupSalesLessons,
  "building-ai-agent-memory": BuildingAiAgentMemory,
  "the-llm-wiki-vault": TheLlmWikiVault,
  "publishing-dual-registry-npm": PublishingDualRegistryNpm,
  "switching-to-pi-coding-agent": SwitchingToPiCodingAgent,
};

export function getArticleBody(slug: string): (() => React.JSX.Element) | null {
  return registry[slug] ?? null;
}
