import React from "react";
import { BlogFigure } from "@/components/blog/BlogFigure";
import { BlogCodeBlock } from "@/components/blog/BlogCodeBlock";

// ──────────────────────────────────────────────────────────────────────────────
// Article bodies. Each function is a full-length technical post.
// ──────────────────────────────────────────────────────────────────────────────

function DockerToPodman() {
  return (
    <>
      <p>
        Docker revolutionised how we think about application deployment. For years it was my
        default tool: reliable, well-documented, and universally supported in CI pipelines,
        cloud platforms, and tutorials. But as my infrastructure grew more complex and my
        interest in NixOS deepened, two things about Docker started to bother me enough to
        look for an alternative.
      </p>
      <p>
        The first was the daemon. Docker requires a root-privileged background process to manage
        container lifecycle. It's always running, owns the socket, and if it crashes, every
        container it manages goes down with it. The second was the surface area. Every container
        you run is, at some level, requesting capabilities from a process running as root. For
        local development that feels acceptable. For anything production-adjacent, it felt
        increasingly uncomfortable.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        How Podman is different by design
      </h2>
      <p>
        Podman is OCI-compliant and CLI-compatible with Docker; most commands are drop-in
        replacements. But the architecture is fundamentally different. There is no daemon.
        Each container is a child process of the user who launched it, managed directly by
        the kernel through a fork-exec model. If your terminal session ends, the containers
        end with it unless you explicitly daemonise them via systemd.
      </p>
      <p>
        Rootless containers are the default, not an option. Your user namespace handles the
        privilege mapping. A container that thinks it is running as root inside the container
        is actually running as your unprivileged user on the host. This changes the risk profile
        of a container breakout: instead of escaping to a root-owned daemon, an attacker escapes
        to your user account.
      </p>
      <BlogFigure
        title="Container Model"
        caption="Docker's client-daemon-containerd chain versus Podman's direct fork-exec. Fewer layers means fewer things that can go wrong silently."
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        The migration in practice
      </h2>
      <p>
        Migration was straightforward for most of my stack. I added an alias and ran my Compose
        files with <code>podman-compose</code> for the first week to catch anything unexpected.
        The two places that required real attention were:
      </p>
      <p>
        <strong>Systemd socket activation.</strong> On NixOS, Podman integrates cleanly with
        systemd for persistent containers (databases, dev services). You define them as systemd
        units with <code>podman run --rm</code> and let systemd manage lifecycle, restart
        policies, and logging. This is actually cleaner than Docker's restart-policy flags.
      </p>
      <p>
        <strong>Network namespaces.</strong> Podman's default network handling on Linux differs
        from Docker's. By default, containers use the <code>slirp4netns</code> user-space
        networking driver which has higher overhead than Docker's bridge. For development this
        is irrelevant; for performance-sensitive services I switched to the Netavark driver
        which is closer to Docker's performance profile.
      </p>
      <BlogCodeBlock
        filename="containers.nix"
        code={`# NixOS — declarative Podman with systemd socket activation
{ config, pkgs, ... }:
{
  virtualisation.podman = {
    enable = true;
    dockerCompat = true;   # alias docker -> podman
    defaultNetwork.settings.dns_enabled = true;
  };

  # Postgres as a rootless podman container managed by systemd
  virtualisation.oci-containers.containers.postgres = {
    image = "postgres:16-alpine";
    autoStart = true;
    environment = {
      POSTGRES_USER = "dev";
      POSTGRES_DB   = "devdb";
    };
    volumes = [ "pgdata:/var/lib/postgresql/data" ];
    ports   = [ "5432:5432" ];
  };

  users.users.mel.extraGroups = [ "podman" ];
}`}
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        What I actually gained
      </h2>
      <p>
        The biggest practical win was not security. It was composability with the rest of my
        NixOS setup. Podman containers are declared in <code>configuration.nix</code> alongside
        my editor, shell, and fonts. The whole system is version-controlled. I can rebuild
        it on a new machine and get the same containers, the same configuration, the same
        state. With Docker, the daemon and its state were always a separate thing to manage.
      </p>
      <p>
        Twelve months on: I haven't missed the Docker daemon once. Rootless by default, better
        systemd integration, and first-class NixOS module support made the switch easier and
        the result better than I expected.
      </p>
    </>
  );
}

function FromWslToNixos() {
  return (
    <>
      <p>
        For the first few years of my career, WSL was my development environment. Windows for
        email, meetings, and browser use; a Linux subsystem for everything else. It worked
        remarkably well. The integration was seamless enough that I rarely noticed the boundary,
        and for the kinds of web development projects I was working on, it covered everything I
        needed.
      </p>
      <p>
        The problems accumulated slowly. WSL2's I/O performance on cross-filesystem operations
        was noticeably slower than native Linux. Window management on Windows was inflexible.
        My development environment had drifted from a clean state through months of apt installs,
        manual config edits, and one-off fixes. When I needed to set up a second machine I had
        no reliable way to reproduce what I had built. I knew it was time for a change.
      </p>
      <p>
        I spent two weeks evaluating distributions. Ubuntu for familiarity, Arch for control,
        Fedora as a middle ground. I landed on NixOS for a reason none of the others could
        offer: the entire operating system is a function. You give it a configuration file.
        It gives you a deterministic machine state. Roll back to yesterday's state with one
        command. Rebuild from scratch on new hardware and get the same environment.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        What declarative actually means in practice
      </h2>
      <p>
        On a standard Linux distribution, your system state is the cumulative result of every
        command you've ever run as root. You know what's installed, mostly. You know what's
        configured, mostly. But you can't easily answer "if I reinstall from scratch today,
        what exact state do I end up in?" without running through the same sequence of commands.
      </p>
      <p>
        On NixOS, the answer is: the state described in <code>/etc/nixos/configuration.nix</code>.
        Every package, every service, every environment variable, every user account, every
        font, every systemd unit is declared there. The Nix package manager builds the exact
        set of derivations specified and constructs the system from those immutable pieces.
        Nothing is installed that isn't declared. Nothing runs that isn't configured.
      </p>
      <BlogFigure
        title="System Config"
        caption="The configuration.nix that sets up the display server, Podman containers, editor extensions, and shell aliases — all in one file, version-controlled."
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Setting up a development environment
      </h2>
      <p>
        My full stack development setup covers Node.js (via Bun), Python, Go, and database
        tools. On a traditional distro this is several package managers and version managers.
        On NixOS, it's one config block:
      </p>
      <BlogCodeBlock
        filename="configuration.nix (dev environment excerpt)"
        code={`{ config, pkgs, ... }:
{
  environment.systemPackages = with pkgs; [
    # JS / Node
    bun  nodejs_22

    # Python
    python312  uv

    # Go
    go  gopls

    # DB tools
    postgresql_16  redis  prisma-engines

    # Shell + editors
    zsh  starship  neovim  zed-editor  vscode

    # Dev utilities
    git  gh  ripgrep  fzf  bat  jq  httpie

    # Containers
    podman  podman-compose
  ];

  # Shell
  programs.zsh.enable = true;
  users.defaultUserShell = pkgs.zsh;

  # Dev ports always open locally
  networking.firewall.allowedTCPPorts = [ 3000 5432 6379 8000 ];
}`}
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        The learning curve and the payoff
      </h2>
      <p>
        The Nix language is genuinely unusual. It is lazy, functional, and purely expression-based.
        Simple things (install a package) are trivial. Complex things (override a derivation,
        patch a build input) require understanding the evaluation model. For most developers the
        learning curve is steeper than Arch's manual process but shallower than people expect
        once you stop thinking of it as scripting and start thinking of it as data.
      </p>
      <p>
        The payoff is real. My development machine has not experienced configuration drift in
        over a year. When I got a new laptop, I transferred my <code>configuration.nix</code>,
        ran <code>nixos-rebuild switch</code>, and had a working environment within an hour.
        No missing tools, no wrong versions, no forgotten setup steps. The entire system is
        version-controlled in a private repository. Every change is a git commit. Every
        rollback is a <code>nixos-rebuild --rollback</code>.
      </p>
      <p>
        For anyone who spends significant time in a terminal and values reproducibility,
        NixOS is worth the investment. It changes the relationship between you and your
        development environment: instead of something you maintain and occasionally repair,
        it becomes something you declare and trust.
      </p>
    </>
  );
}

function BuildingFullStackLms() {
  return (
    <>
      <p>
        The brief for BomaEd was deceptively simple: an online platform where educators could
        publish courses, students could enrol and pay, and everyone could track progress. Simple
        briefs have a way of expanding. By the time the platform shipped, it had become a
        multi-role system with video streaming, Stripe webhooks, certificate generation,
        role-based content gating, and a full instructor dashboard. This is what I learned
        building it.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Choosing the architecture
      </h2>
      <p>
        Next.js App Router was the right choice from the start. Server Components handle the
        heavy lifting: course catalogue pages, student dashboards, and admin views are rendered
        server-side with no client-side fetch waterfalls. Client Components are reserved for
        interactive elements: video players, progress trackers, quiz interfaces.
      </p>
      <p>
        Prisma with PostgreSQL on Supabase handles the data layer. The schema needed to model
        courses, chapters, lessons, enrolments, progress, certificates, and payments. Getting
        the data model right early avoided the kind of migration pain that compounds when you
        have paying customers. The enrolment model in particular went through three iterations
        before I got it right:
      </p>
      <BlogCodeBlock
        filename="schema.prisma (core models)"
        code={`model Course {
  id          String       @id @default(cuid())
  slug        String       @unique
  title       String
  price       Float
  published   Boolean      @default(false)
  instructorId String
  instructor  User         @relation(fields: [instructorId], references: [id])
  chapters    Chapter[]
  enrollments Enrollment[]
  createdAt   DateTime     @default(now())
}

model Enrollment {
  id        String    @id @default(cuid())
  userId    String
  courseId  String
  paidAt    DateTime  @default(now())
  progress  Int       @default(0)     // 0–100
  completedAt DateTime?
  stripeSessionId String? @unique     // idempotency key
  user      User      @relation(fields: [userId], references: [id])
  course    Course    @relation(fields: [courseId], references: [id])

  @@unique([userId, courseId])        // one enrolment per user per course
}`}
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Payments and idempotency
      </h2>
      <p>
        Stripe Checkout handles the payment flow. The student clicks "Enrol", a Checkout
        Session is created server-side, and Stripe redirects the student back to the platform
        after payment. The webhook endpoint receives the <code>checkout.session.completed</code>
        event, verifies the signature, and creates the Enrolment record.
      </p>
      <p>
        The <code>stripeSessionId</code> unique constraint on Enrolment is the idempotency
        mechanism. If Stripe re-delivers the same webhook event (which it does, on retry),
        the Prisma upsert checks the unique constraint and skips the duplicate. This single
        constraint prevented double-enrolment bugs that would have been very difficult to debug
        in production.
      </p>
      <BlogFigure
        title="Enrolment Flow"
        caption="Checkout Session created server-side. Stripe webhook creates the Enrolment. The stripeSessionId unique constraint handles re-delivery. No double charges, no double access."
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Video delivery with Uploadthing
      </h2>
      <p>
        Uploadthing was the clearest win in the stack. It abstracts S3 with a typed API that
        integrates with Next.js route handlers. Instructors upload videos through a drag-drop
        interface; Uploadthing returns a URL that's stored in the Lesson record. Playback
        is standard HTML5 video with custom progress tracking.
      </p>
      <p>
        For a first version this is sufficient. The next step would be HLS transcoding for
        adaptive bitrate, but Uploadthing's direct URL delivery was fast enough for the target
        audience on reasonable connections.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        What I'd do differently
      </h2>
      <p>
        The main thing I'd change is moving certificate generation from a serverless function
        to a background job queue. Generating PDFs with Puppeteer in a Vercel serverless
        function works but times out under load. A job queue like Bull or Trigger.dev would
        decouple the generation from the request/response cycle. Everything else — the schema,
        the payment flow, the file storage — I'd keep essentially the same.
      </p>
    </>
  );
}

function MultilingualNextjsI18n() {
  return (
    <>
      <p>
        When Elitemetrix Solutions needed its website in English, Swahili, and French, I
        reached for Next.js App Router's middleware-based routing rather than a third-party
        i18n library. The goal was locale routing without client-side i18n overhead: no 50KB
        runtime bundle, no hydration mismatch, no locale switching with page flickers.
      </p>
      <p>
        The approach: middleware intercepts every request, determines the preferred locale
        from headers and cookies, and rewrites the URL to a locale-prefixed path. Every page
        in the app lives under <code>/en/</code>, <code>/sw/</code>, or <code>/fr/</code>.
        All copy comes from server-side dictionary imports. No i18n context, no translation
        function in components.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        The middleware
      </h2>
      <p>
        The locale negotiation runs on every request before any rendering happens. It reads
        the <code>Accept-Language</code> header, checks for a stored locale cookie, and falls
        back to the default:
      </p>
      <BlogCodeBlock
        filename="middleware.ts"
        code={`import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "sw", "fr"];
const defaultLocale = "en";

function getLocale(request: NextRequest): string {
  // 1. Stored preference takes priority
  const stored = request.cookies.get("locale")?.value;
  if (stored && locales.includes(stored)) return stored;

  // 2. Negotiate from Accept-Language header
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const languages = new Negotiator({
    headers: { "accept-language": acceptLanguage },
  }).languages();

  try {
    return match(languages, locales, defaultLocale);
  } catch {
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip if already locale-prefixed
  const hasLocale = locales.some(
    (l) => pathname.startsWith(\`/\${l}/\`) || pathname === \`/\${l}\`
  );
  if (hasLocale) return;

  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = \`/\${locale}\${pathname}\`;
  return NextResponse.redirect(url);
}`}
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Dictionary pattern for copy
      </h2>
      <p>
        Each locale has a typed dictionary file. Pages receive the dictionary as a prop from
        a server component — no hook, no context, no client-side fetch:
      </p>
      <BlogCodeBlock
        filename="lib/getDictionary.ts"
        code={`import "server-only";

type Locale = "en" | "sw" | "fr";

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  sw: () => import("@/dictionaries/sw.json").then((m) => m.default),
  fr: () => import("@/dictionaries/fr.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

// Usage in a page:
// const dict = await getDictionary(params.lang);
// <h1>{dict.hero.headline}</h1>`}
      />
      <BlogFigure
        title="Locale Routing"
        caption="Request hits middleware. Locale is negotiated. URL is rewritten. The dictionary is imported server-side. No client bundle for i18n logic."
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Language switcher
      </h2>
      <p>
        The language switcher updates the stored locale cookie and redirects to the same page
        under the new locale prefix. The key detail: the switcher is a server action, not a
        client-side navigation. This avoids any flash of un-translated content.
      </p>
      <p>
        The biggest tradeoff with this approach is that every locale-prefixed path is a
        separate Next.js page route. For a ten-page site with three locales you have thirty
        routes. This is manageable but means SEO metadata, canonical URLs, and
        <code>hreflang</code> tags need to be set correctly for each. I wrote a
        <code>generateMetadata</code> wrapper that accepts the locale and dictionary and
        constructs the right canonical + alternates block automatically.
      </p>
      <p>
        The result: locale routing with zero runtime overhead, full SSR for all locales,
        and no third-party i18n dependency. The trade-off is slightly more boilerplate per
        page. For a corporate site with stable content that trade-off is firmly worth it.
      </p>
    </>
  );
}

function StartupSalesLessons() {
  return (
    <>
      <p>
        I attended a virtual webinar hosted by JHUB Africa and gDIH featuring Brewster Barclay,
        AWS Partner Manager and startup mentor. The session was titled "Creating New Enterprises"
        and was nominally about writing strong project proposals. What Brewster actually
        delivered was a pointed critique of how technical founders misunderstand the relationship
        between building and selling. It challenged how I was thinking about two projects I had
        at the time.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        The most common failure mode
      </h2>
      <p>
        Brewster's central observation: most technical founders build products that no one
        asked for, then wonder why no one buys them. They have strong opinions about what
        people need, validated mainly by internal logic and personal frustration with existing
        tools. The market validation step — actually talking to potential customers and
        listening to what they say — is treated as optional, or deferred until after the
        product is built.
      </p>
      <p>
        The consequences are predictable. Six months of engineering time, a working product,
        and twelve users. Not twelve hundred. Twelve. The product might be technically excellent.
        It might solve the problem the founder had. It just doesn't solve a problem enough
        people are willing to pay to have solved.
      </p>
      <BlogFigure
        title="Market Discovery"
        caption="Talk before you build. The conversations that happen before the first commit are the cheapest possible form of product research."
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        What real validation looks like
      </h2>
      <p>
        Brewster was specific about what validation actually means. It is not a survey.
        It is not showing a mockup and asking "would you use this?" It is sitting with potential
        customers, asking them to describe their current workflow, listening for the friction
        points, and watching whether they light up when a specific problem is named. The insight
        that changes a product often arrives not from a question but from an answer to a
        completely different question.
      </p>
      <p>
        He gave an example from his mentoring work: a founder building a logistics tool had
        interviewed fifteen potential customers about their supply chain pain points. Thirteen
        of them mentioned a specific pain unprompted. The founder had not planned to build
        anything to address it. After the interviews, it became the core feature of the product.
        That core feature is why the product has customers.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Finding the underserved segment
      </h2>
      <p>
        The second major point was about positioning. Saturated markets almost always contain
        underserved segments. The question is not "is this market competitive?" but "who is
        being left out by the current solutions, and what does being left out cost them?"
      </p>
      <p>
        Geographic segments, size segments, and language segments are the most common. A tool
        built for US enterprise procurement processes works poorly for East African SME
        procurement. The existing tools serve the US market because that's where the founding
        teams are. The SME in Nairobi is left out. That's a real, addressable market.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Sales is day-one work
      </h2>
      <p>
        The advice that stayed with me: do not hire a salesperson and expect sales to start.
        The founder's job in the early stages is to understand the customer so completely that
        you can articulate their problem better than they can. That understanding only comes
        from doing the sales yourself. You can't outsource that to someone else until you have
        proven that a repeatable sales motion exists. Before that point, what you have is not
        a sales process, it's an experiment.
      </p>
      <blockquote className="border-l border-black/20 pl-7 text-[26px] leading-tight tracking-[-0.05em] text-black">
        &ldquo;If you can't sell it yourself, you don't understand the problem well enough to
        build the right solution.&rdquo;
      </blockquote>
      <p>
        I left the webinar with two things I changed immediately: I started having real
        customer discovery conversations before adding features, and I stopped measuring
        progress by lines of code shipped. The latter was harder to change than the former.
      </p>
    </>
  );
}

function BuildingAiAgentMemory() {
  return (
    <>
      <p>
        Every AI coding session starts fresh. The model has no memory of the last conversation,
        the architectural decisions already made, the preferences you've stated, or the context
        built up over weeks of work on a codebase. For a one-off task this doesn't matter.
        For sustained work on a real project, the cost compounds: you re-explain the same
        context, the model re-suggests patterns you've already evaluated and rejected, and
        you re-state preferences you've mentioned before.
      </p>
      <p>
        pi-persistent-intelligence solves this with a structured, file-based memory store
        that the agent reads at the start of every session and writes to throughout. The design
        is deliberately simple: JSONL files, a TypeScript SDK, and a small set of concepts
        that scale from a single developer to a team.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Three memory layers
      </h2>
      <p>
        The system uses three stores with different lifecycle rules. The <strong>daily log</strong>{" "}
        is append-only. Every session writes to it: decisions made, code changed, questions left
        open, patterns noticed. It is never edited, only appended to. This preserves the full
        history of what the agent knew and when it knew it.
      </p>
      <p>
        The <strong>long-term store</strong> holds curated, high-confidence facts about the
        project: conventions, preferences, architectural constraints, things the agent should
        always know. Each entry has a confidence score, a stability rating, and a review
        schedule. High-confidence stable entries (0.9+ confidence, "stable" stability) are
        injected with <code>📌 RULE:</code> prefixes to distinguish them from lower-confidence
        suggestions.
      </p>
      <p>
        The <strong>inbox</strong> is the promotion gate. Candidate memories from the daily
        log sit here until reviewed. The review panel surfaces at the start of the next session
        when three or more candidates have accumulated. You decide what gets promoted to
        long-term, what gets discarded, and what needs revision.
      </p>
      <BlogFigure
        title="Memory Lifecycle"
        caption="Daily log captures everything. Inbox governs what gets promoted. Long-term holds what the agent should always know. Each layer has different lifecycle rules."
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Why JSONL
      </h2>
      <p>
        JSONL (newline-delimited JSON) was chosen for specific reasons. Each memory record
        is one line. Git diffs are readable: a single new memory entry is a single line addition.
        Appending is atomic. The format is readable in any text editor and parseable by any
        language. There's no database to run, no migration to manage, no schema to evolve
        with a migration script.
      </p>
      <p>
        The canonical data is the JSONL. Markdown summaries generated from it are projections,
        useful for reading but not for editing. This separation prevents a common failure mode
        in personal knowledge management: editing a rendered view and then having the canonical
        data diverge from what you think you wrote.
      </p>
      <BlogCodeBlock
        filename="memory record (JSONL, single line)"
        code={`{
  "id": "mem_20260512_a1b2",
  "layer": "L2",
  "scope": { "type": "project", "project": "mont3ll-portfolio" },
  "tags": ["tooling", "workflow"],
  "statement": "Always prefer bun over npm for package management in this project.",
  "confidence": 0.95,
  "stability": "stable",
  "ruleType": "prefer_pattern",
  "evidence": [{ "type": "conversation", "ref": "session-2026-05-12", "note": "stated explicitly" }],
  "review": { "cadence_days": 90, "next_review": "2026-08-12", "change_condition": "if project switches runtime" },
  "status": "active",
  "created_at": "2026-05-12T10:23:00Z",
  "updated_at": "2026-05-12T10:23:00Z"
}`}
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Context injection and the KV-cache
      </h2>
      <p>
        Memory is injected as a per-turn custom message, not as a system prompt addition.
        This matters for token cost. Most LLM providers cache the system prompt prefix
        (KV-cache). Mutating the system prompt every session breaks the cache and costs
        roughly 10x more per token for the cached portion. Injecting as a custom message
        preserves the cache prefix while still making the memory available to the model
        on every turn.
      </p>
      <p>
        The injection filter skips trivial prompts ("ok", "thanks", "/reload", single-word
        responses) to avoid wasting context budget on turns that don't need historical context.
        For a model with a 200K token context window this seems paranoid. For models with 32K
        windows on local hardware, it's the difference between memory fitting in context or not.
      </p>
    </>
  );
}

function TheLlmWikiVault() {
  return (
    <>
      <p>
        Notes taken for yourself age better than notes taken to share. Notes where every
        claim traces back to a source age better still. The LLM wiki vault is a personal
        knowledge base built on a specific premise: the raw sources are immutable, the wiki
        layer is maintained by an LLM agent, and every factual claim on every page carries
        a citation to an ingested source.
      </p>
      <p>
        The motivation was a practical failure. I had accumulated hundreds of Obsidian notes
        over two years. They were useful individually but didn't compound. Searching for a
        concept gave me five different notes that partially covered it, each written in
        isolation, none linking to the others. The knowledge didn't build on itself.
        I wanted a system where the agent did the bookkeeping and the knowledge compounded.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        The three-layer model
      </h2>
      <p>
        The vault has three layers: raw sources, the wiki, and the schema. Raw sources
        (papers, articles, videos, documentation) live in <code>2. Source material/</code>
        and are strictly immutable after ingestion. The agent appends a structured block
        at the bottom of each source (key takeaways, wiki updates, cited-by links) but
        never touches the body.
      </p>
      <p>
        The wiki layer lives in <code>6. Zettelkasten/</code> with typed subfolders for
        entities, concepts, and comparisons. Every factual claim on a wiki page ends with
        a citation to an ingested source. If the source hasn't been ingested, the agent
        creates a stub source page instead of citing a confabulated reference.
      </p>
      <BlogFigure
        title="Provenance Chain"
        caption="Sources are read once and never modified. Wiki pages cite sources. The cited-by section on each source lists every wiki page that references it. Lint flags directional mismatches."
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Citation discipline and the stub system
      </h2>
      <p>
        The most important rule in the schema is also the most fragile: every claim needs
        a citation, and citations must point to real ingested files. The temptation for an
        LLM is to fabricate citations that look plausible but don't exist. The stub system
        addresses this.
      </p>
      <p>
        When a source is mentioned in the literature review but not directly read, the agent
        creates a stub source page marked <code>#unread #secondhand</code>. Any wiki claim
        that relies on that stub must surface the provenance chain in prose: "as cited in
        [Survey Paper] referencing [Stub Author Year]." This way the reader knows the claim
        is second-hand and the agent can't present it as first-hand knowledge.
      </p>
      <BlogCodeBlock
        filename="AGENTS.md (provenance rule excerpt)"
        code={`## Citation Discipline

Every factual claim on an entity, concept, comparison, MOC, or synthesis page
MUST end with a citation: [[Source Title]] linking to a source that has been
ingested into 2. Source material/.

Rules:
- A citation is satisfied only if the linked file EXISTS in 2. Source material/.
  Confabulated links are forbidden — create a stub first.
- For secondhand sources: write "as cited in [[Lit Review]] referencing
  [[Author Year Stub]]" — never present secondhand claims as direct knowledge.
- Multiple sources for one claim: chain links inline.`}
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Bidirectional backlinks and the lint pass
      </h2>
      <p>
        When a wiki page cites a source, the agent adds that wiki page to the source's
        <code># cited by</code> section in the same operation. This creates a fully
        bidirectional link graph. Every source knows which wiki pages build on it.
        Every wiki page knows where its claims came from.
      </p>
      <p>
        The lint operation checks for directional mismatches (a wiki page cites a source
        but that source's cited-by section doesn't list the wiki page), broken citations
        (links pointing to files that don't exist), orphaned pages (zero inbound links),
        and promotion candidates (frequently-cited stubs that would benefit from first-hand
        reading). Running a lint pass every few weeks keeps the graph consistent as the vault grows.
      </p>
      <p>
        The vault has been running for about four months. It now contains around two hundred
        source notes and three hundred wiki pages. The compounding effect is real: when a new
        source touches a well-developed concept, the agent can integrate it in minutes rather
        than starting from scratch. That's the payoff for maintaining the citation discipline.
      </p>
    </>
  );
}

function PublishingDualRegistryNpm() {
  return (
    <>
      <p>
        When I published pi-persistent-intelligence, I wanted it available on both npmjs.com
        (the public default) and GitHub Packages (for projects that authenticate via GitHub
        tokens and want packages co-located with their code). The two registries are
        independent: separate authentication, separate namespacing rules, separate quotas.
        Publishing to one does nothing for the other.
      </p>
      <p>
        This is a point of confusion for most developers the first time they encounter it.
        The GitHub Packages tab on a repo only shows packages published to
        <code>npm.pkg.github.com</code> explicitly. If you've published to npmjs.com, the
        GitHub Packages tab will be empty, regardless of whether your repo is the source.
        The two are related only in that your package lives in both; they share no data.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Package name requirements
      </h2>
      <p>
        GitHub Packages requires scoped packages. The scope must match your GitHub username
        or organisation exactly: <code>@mont3ll/pi-persistent-intelligence</code>, not
        <code>pi-persistent-intelligence</code>. If your scope doesn't match your GitHub
        account, authentication fails silently at publish time — you get an auth error that
        looks like a permissions problem but is actually a naming issue.
      </p>
      <p>
        npmjs.com also accepts scoped packages but doesn't require them. For public packages,
        scoped publishing on npmjs.com requires the <code>--access public</code> flag since
        scoped packages default to private.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        The dual-registry workflow
      </h2>
      <p>
        A single GitHub Actions workflow handles both registries. It triggers on version tags,
        builds the package once, and publishes to each registry in sequence using different
        <code>.npmrc</code> configurations:
      </p>
      <BlogCodeBlock
        filename=".github/workflows/publish.yml"
        code={`name: Publish

on:
  push:
    tags: ["v*"]

jobs:
  publish-npm:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun test
      - run: bun run build
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: "https://registry.npmjs.org"
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}

  publish-gpr:
    needs: publish-npm
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run build
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: "https://npm.pkg.github.com"
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: \${{ secrets.GITHUB_TOKEN }}`}
      />
      <BlogFigure
        title="Dual Registry"
        caption="One build, two publish jobs. The only difference is the registry URL and auth token. The GitHub token is automatically available; the npm token must be added as a secret."
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Versioning and the prepublish gate
      </h2>
      <p>
        The workflow triggers on <code>v*</code> tags. Versioning is manual and deliberate.
        The <code>package.json</code> has a <code>prepublishOnly</code> script that runs
        <code>bun test && bun run typecheck</code>. This runs in CI as part of the build step,
        but having it in <code>prepublishOnly</code> also means a local <code>npm publish</code>
        can't succeed without passing tests.
      </p>
      <p>
        Semver discipline matters here. The package is in 0.x which signals pre-stable API.
        Each release should represent a coherent feature set, not just an accumulation of
        commits. Publishing multiple versions in a single working session inflates the version
        history and makes the changelog misleading for consumers who track versions.
      </p>
    </>
  );
}

function SwitchingToPiCodingAgent() {
  return (
    <>
      <p>
        Every AI coding tool I used before PI worked the same way: open a chat, explain the
        context, ask the question, get an answer, apply the answer, close the chat. The next
        session starts blank. Whatever understanding was built up in the previous conversation
        is gone. For answering specific questions this is fine. For extended collaborative
        work on a codebase, it's a constant overhead.
      </p>
      <p>
        The tools themselves are impressive. The models have strong capabilities. The problem
        is not the model — it's the session model. Every session is an interview with a
        contractor who is brilliant but arrived today and has no idea what happened yesterday.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        What a persistent agent actually changes
      </h2>
      <p>
        PI runs as a TUI in the terminal and reads from a structured memory store at the
        start of every session. The long-term memory contains project conventions, tool
        preferences, architectural constraints, and recurring patterns. The daily log
        captures what happened in previous sessions. Before the first turn of any session,
        the agent already knows what you've been working on, what decisions have been made,
        and what patterns you prefer.
      </p>
      <p>
        The practical difference shows up immediately. When I open PI on the portfolio project,
        it knows we use Bun, that we prefer <code>overflow-x: clip</code> over
        <code>overflow-x: hidden</code> for the particle canvas fix, and that the project
        data files use TypeScript literal types. I don't re-explain these things. The agent
        just knows them.
      </p>
      <BlogFigure
        title="Session Continuity"
        caption="Each session starts with injected long-term context. Each session contributes new daily log entries. The inbox governs what gets promoted to long-term. Context compounds across sessions."
      />
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        Staying in the terminal
      </h2>
      <p>
        PI runs entirely in the terminal. No browser tab, no Electron window, no electron
        context switch. The agent and the editor share the same screen. Agentic commands run
        directly in the same shell that the project lives in. For a keyboard-driven workflow
        this changes the texture of the work: asking the agent a question feels more like
        thinking out loud than switching applications.
      </p>
      <p>
        The TUI has a skills system: prompt templates and specialised behaviours that can be
        composed per task. For the portfolio I loaded skills for brainstorming, TDD, and
        view transitions. Each skill injects specific instructions into the agent's context
        for that type of work. The agent adapts its behaviour without needing a different tool.
      </p>
      <h2 className="pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black">
        The trust problem
      </h2>
      <p>
        The biggest change is harder to quantify: trust. When the agent doesn't remember what
        you decided, you second-guess its suggestions. Maybe it doesn't know about the constraint
        that rules out this approach. Maybe it's suggesting a pattern you already evaluated and
        rejected. Every suggestion carries a small tax of "but does it know the context?"
      </p>
      <p>
        When the agent does remember, that tax disappears. You stop verifying whether it has
        enough context to give reliable advice, because you can see that it does. Suggestions
        are evaluated on their merits, not on whether the model is working from a complete picture.
        That shift in trust is what makes the whole system worth the setup cost. The memory
        system pays for itself within the first few days of a sustained project.
      </p>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Registry
// ──────────────────────────────────────────────────────────────────────────────

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
