import React from "react";
import { BlogFigure } from "@/components/blog/BlogFigure";
import { BlogCodeBlock } from "@/components/blog/BlogCodeBlock";

const headingClass = "pt-4 text-[30px] leading-tight tracking-[-0.06em] text-black";

function BuildingAiAgentMemory() {
  return (
    <>
      <p>
        I built pi-persistent-intelligence after running into the same problem on long coding projects: the agent could help in the moment, but it kept losing the decisions that made the work safe. It would forget naming rules, project constraints, previous debugging outcomes, release habits, and the small corrections that only appear after a few days of real use.
      </p>
      <p>
        That sounds like a productivity annoyance, but it becomes a system problem quickly. If an agent forgets why a decision was made, it may reopen settled work. If it remembers something wrong, it can turn a bad assumption into policy. So the goal was not to give the agent a giant scrapbook. The goal was to build memory with review, evidence, correction, and retrieval as first-class concerns.
      </p>
      <BlogFigure
        src="/images/blog/pi-memory-inbox-overlay.png"
        title="Memory inbox"
        caption="The inbox view keeps candidate memories reviewable before they become durable project context."
      />
      <h2 className={headingClass}>The first rule: memory is not automatically true</h2>
      <p>
        A lot of memory systems treat capture as the hard part. I treated capture as the risky part. Anything a model stores can be incomplete, stale, or based on a misunderstanding. That is why pi-persistent-intelligence uses a promotion flow: candidates can be captured during work, but durable memory needs structure and review.
      </p>
      <p>
        The package separates daily session context from long-term records. Daily memory is useful because it keeps the current work coherent. Long-term memory is more sensitive because it affects future sessions. A rule such as "always run bun test before publishing" is useful. A rule such as "this project no longer supports X" can cause damage if it is wrong. Those two records should not have the same path into the system.
      </p>
      <h2 className={headingClass}>Why JSONL became the source of truth</h2>
      <p>
        I chose JSONL because it is boring in the right way. Each record is a line. It can be inspected with standard tools, diffed in git, backed up without a database migration, and transformed later if the schema changes. Markdown projections are useful for reading, but they are not the canonical store. That rule matters because humans edit markdown too easily, and once a rendered view becomes the source of truth, structured memory starts to drift.
      </p>
      <p>
        The records carry fields such as confidence, tags, scope, memory type, evidence, and lifecycle state. That makes retrieval more useful than keyword search alone. The agent can ask for project rules, recent corrections, contested items, or release workflow notes instead of pulling an undifferentiated blob of text into context.
      </p>
      <BlogCodeBlock
        filename="memory-record.jsonl"
        code={`{"kind":"instruction","ruleType":"testing","scope":"project","claim":"Run bun test and bun run typecheck before publishing.","confidence":0.91,"evidence":["prepublish gate"],"status":"active"}
{"kind":"correction","ruleType":"architecture","scope":"project","claim":"Rendered markdown is not canonical. JSONL is the source of truth.","confidence":0.92,"status":"active"}`}
      />
      <h2 className={headingClass}>The inbox is where the human stays in control</h2>
      <p>
        The inbox is deliberately frictional. It gives the agent a place to propose memory without silently changing future behavior. A human can approve, skip, revise, or defer an item. That keeps the memory store from becoming a pile of model guesses. It also makes the agent easier to correct because corrections become durable records instead of one-off scoldings in a chat transcript.
      </p>
      <BlogFigure
        src="/images/blog/pi-memory-learnings-overlay.png"
        title="Learnings"
        caption="The learnings view surfaces durable records, recent corrections, and operational rules for future sessions."
      />
      <h2 className={headingClass}>Search had to explain itself</h2>
      <p>
        Retrieval is where memory either helps or becomes noise. I built session search and recall diagnostics so the agent can inspect why a piece of context appeared. If a record is stale, contested, or low confidence, the system should say so. If a memory came from a specific session or evidence record, that should be visible too.
      </p>
      <p>
        That design changed how I work with agents. Instead of asking an assistant to "remember this" and hoping it behaves later, I can see the record, the evidence, the confidence, and the retrieval path. The result is less magical and more useful. I prefer that tradeoff.
      </p>
      <h2 className={headingClass}>What I learned building it</h2>
      <p>
        The biggest lesson was that agent memory is a governance problem before it is a storage problem. The hard questions are about what should become durable, who can correct it, how stale claims are handled, what evidence supports the record, and how future agents should see it. The implementation is TypeScript and JSONL, but the product is really a set of boundaries around agent behavior.
      </p>
      <p>
        That is why I still think of pi-persistent-intelligence as infrastructure rather than a feature. It makes the agent less forgetful, but more importantly, it makes its memory inspectable. For long projects, that is the difference between a useful assistant and a confident stranger who keeps starting over.
      </p>
    </>
  );
}

function TheLlmWikiVault() {
  return (
    <>
      <p>
        The LLM Wiki vault came from a worry I kept running into while using agents for research. If an agent reads a source, writes a summary, then later reads its own summary as if it were the source, the knowledge base starts to rot. The writing may look clean, but the provenance gets weaker every time the system compresses itself.
      </p>
      <p>
        I wanted a structure where an agent could help maintain a research wiki without being allowed to corrupt the raw material. The solution was a three-layer vault: raw sources, wiki synthesis, and schema rules. The source layer is treated as immutable. The wiki layer can evolve. The schema tells the agent what it may touch, what it must cite, and what requires human review.
      </p>
      <BlogFigure
        src="/images/blog/the-llm-wiki-vault.png"
        title="LLM Wiki"
        caption="The vault separates immutable source notes from synthesis pages, indexes, logs, and reviewable graph updates."
      />
      <h2 className={headingClass}>The source layer is protected</h2>
      <p>
        Source notes live in a dedicated folder. The reference and notes sections are not edited after ingest. The agent can append integration sections such as key takeaways, wiki updates, cited-by links, extraction version, and ingest timestamp. It cannot rewrite the source body to make later synthesis easier.
      </p>
      <p>
        That rule looks strict until you need to debug a claim. If a page says something about a paper, policy, or technical article, I want to trace it back to the exact source note that supported it. If the source note has been rewritten by the same agent doing the synthesis, that trace becomes much less useful.
      </p>
      <h2 className={headingClass}>Every claim needs a place to stand</h2>
      <p>
        The wiki layer uses entity pages, concept pages, comparison pages, atomic notes, and maps of content. The important rule is citation discipline. If a factual claim would make a reader ask "says who?", it needs a wiki link to an ingested source. That is slow, but it keeps the system honest.
      </p>
      <p>
        Secondhand sources get special handling. If a literature review mentions a paper I have not read, the vault can create a stub, but the prose has to say that the claim is secondhand. This prevents a common failure mode where a review citation gets laundered into direct knowledge.
      </p>
      <BlogCodeBlock
        filename="source-summary.md"
        code={`# reference
Original paper, article, or documentation link

# notes
Raw source body. The agent does not rewrite this section.

# key takeaways
- Source-backed bullets added after ingest

# cited by
- [[Concept Page]]

# ingested
2026-07-08 10:30`}
      />
      <h2 className={headingClass}>The index and log make the wiki navigable</h2>
      <p>
        A growing vault needs more than search. It needs a catalog and a history. The index lists sources, entities, concepts, comparisons, atomic notes, and MOCs. The log records operations such as ingests, notes, schema updates, and substantive queries. When an agent starts work, it reads the schema, the index, and the recent log tail before making changes.
      </p>
      <p>
        That workflow makes the vault cumulative. New work can build on old work without guessing what exists. It also makes mistakes easier to audit because every mutation should show up in the log and every citation should have a backlink from the source.
      </p>
      <h2 className={headingClass}>Why this matters outside Obsidian</h2>
      <p>
        The pattern applies to any AI system that answers from trusted data. A customer-facing analytics agent needs a governed metric layer. A coding agent needs project rules and correction history. A research assistant needs source provenance. The surface changes, but the questions stay the same: what is the source, what is the scope, who approved the claim, and how do we fix it when it changes?
      </p>
      <p>
        That is why I kept the vault plain. It is markdown, folders, links, and rules. The value is not a clever UI. The value is the boundary between evidence and synthesis, and the discipline that keeps the agent from mixing the two.
      </p>
    </>
  );
}

function PublishingDualRegistryNpm() {
  return (
    <>
      <p>
        Publishing pi-persistent-intelligence taught me that npm and GitHub Packages only look similar from a distance. They are different registries with different authentication paths, package naming rules, provenance options, and failure modes. Treating them as one destination is how releases get messy.
      </p>
      <p>
        My goal was a release workflow where one tag could build, test, typecheck, and publish the same package to both registries without hiding the difference between them. If npm succeeds and GitHub Packages fails, I want to know that. If provenance is missing, I want the release to make that visible. If the version is wrong, I want the workflow to stop before publishing.
      </p>
      <BlogFigure
        src="/images/blog/publishing-dual-registry-npm.png"
        title="Release"
        caption="The release flow treats npmjs.com and GitHub Packages as separate targets with separate credentials and verification."
      />
      <h2 className={headingClass}>The first mistake was assuming the GitHub Packages tab meant npm</h2>
      <p>
        Publishing to npmjs.com does not populate GitHub Packages. The GitHub repository Packages tab only shows packages published to <code>npm.pkg.github.com</code>. That matters when a package is scoped, because the name, registry, and token must all agree. A package can be correctly published to npm and still be absent from GitHub Packages.
      </p>
      <p>
        Once I treated the registries as separate targets, the workflow became clearer. The npm job uses npm credentials or trusted publishing. The GitHub Packages job uses the GitHub registry and the GitHub token path. Both jobs run after the same verification gate, but they publish independently.
      </p>
      <BlogCodeBlock
        filename="release-gate.txt"
        code={`bun test
bun run typecheck
npm publish --access public --provenance
npm publish --registry https://npm.pkg.github.com`}
      />
      <h2 className={headingClass}>Version discipline mattered more than automation</h2>
      <p>
        Automation can make bad release habits faster. I added a rule for myself: one coherent feature set gets one version. During early package work it is tempting to bump versions repeatedly in one day because every small fix feels important. That creates confusing package history and makes the project look less stable than it is.
      </p>
      <p>
        The package is still pre-stable, so the version should communicate that honestly. A 0.x package can move quickly, but the release history should still be readable. The changelog should explain what changed for users, not narrate every development decision.
      </p>
      <h2 className={headingClass}>What the workflow checks</h2>
      <p>
        The release path checks tests, TypeScript, package metadata, registry configuration, and publish commands. The repository also keeps user-facing documentation separate from private development notes. Public README content explains installation, usage, trust boundaries, and package behavior. Internal architecture rationale stays in private notes until it becomes documentation a user actually needs.
      </p>
      <p>
        That separation made the package easier to present. Users do not need my whole dev diary. They need to know what the package does, how to install it, how memory is stored, what leaves the machine, and how to inspect or remove data.
      </p>
      <h2 className={headingClass}>The practical lesson</h2>
      <p>
        The difficult part of publishing was not writing YAML. It was understanding what each registry expects and refusing to blur the boundaries. The final workflow is not glamorous, but it is predictable. A tag builds the package, gates it, publishes it, and leaves a trail that can be checked later.
      </p>
    </>
  );
}

function SwitchingToPiCodingAgent() {
  return (
    <>
      <p>
        I moved more of my development workflow into PI because I wanted the agent closer to the work. A chat window is useful for isolated questions, but coding involves files, commands, tests, errors, previous decisions, and local context. Keeping the agent outside that loop meant I was constantly copying state back and forth.
      </p>
      <p>
        PI made the workflow feel more like pair programming with a local tool-using assistant. It can read files, run commands, edit code, search sessions, use memory, and work inside the same terminal context as the project. That changes the kind of help I ask for.
      </p>
      <BlogFigure
        src="/images/blog/pi-terminal-workflow.png"
        title="PI workflow"
        caption="The useful shift was moving AI assistance from a detached chat window into the terminal workflow."
      />
      <h2 className={headingClass}>The problem with stateless help</h2>
      <p>
        Stateless help is fine when the question is small. It breaks down when the project has history. A model can explain a framework pattern, but it does not know which pattern this project already rejected. It can suggest a test strategy, but it does not know which test command the package requires before publishing. It can propose a refactor, but it does not know the private constraint that explains the current shape.
      </p>
      <p>
        That gap creates a hidden tax. I spend time deciding whether the answer is technically wrong or just missing context. The longer a project runs, the more expensive that tax becomes.
      </p>
      <h2 className={headingClass}>Memory changed the conversation</h2>
      <p>
        Once PI had access to governed memory and session search, I could ask questions with less preamble. The agent could retrieve release rules, project conventions, past debugging outcomes, and open decisions. It still needed supervision, but it stopped behaving like every session was day one.
      </p>
      <p>
        That is the reason I built more tooling around PI instead of just using it. The harness matters. The model is only one part of the system. The surrounding loop, tools, memory, retrieval, and review process decide whether the assistant is reliable in actual engineering work.
      </p>
      <BlogFigure
        src="/images/blog/pi-memory-learnings-overlay.png"
        title="Context"
        caption="Durable memory makes the agent more useful because corrections and project rules survive the current session."
      />
      <h2 className={headingClass}>What I still do manually</h2>
      <p>
        I do not treat the agent as an autopilot. I still read diffs, run tests, check assumptions, and decide whether a change belongs in the project. The best use of PI is not to stop thinking. It is to remove the mechanical work around context gathering, repetitive edits, and remembering project-specific rules.
      </p>
      <p>
        The workflow that stuck is simple: inspect the current state, ask the agent to reason from files instead of memory alone, make small changes, verify them with commands, then decide what should become durable memory. That loop is slower than blind generation, but it produces work I can defend.
      </p>
    </>
  );
}

function DockerToPodman() {
  return (
    <>
      <p>
        Docker was my default container tool for years. It was reliable, familiar, and supported by almost every tutorial and CI example I used. I did not move away from it because it was broken. I moved because my development environment became more Linux-native, more container-heavy, and more focused on reproducibility.
      </p>
      <p>
        Podman fit that direction better. It gave me Docker-compatible commands without a root-owned daemon, better systemd integration, and a rootless model that felt more natural for local development on NixOS.
      </p>
      <BlogFigure
        src="/images/blog/docker-to-podman.webp"
        title="Podman"
        caption="Podman kept the familiar container workflow while removing the always-running Docker daemon from my local setup."
      />
      <h2 className={headingClass}>The daemon was the real reason</h2>
      <p>
        Docker uses a client-server model. The client talks to a daemon that manages containers. That daemon is powerful and usually runs with elevated privileges. It works, but it also creates a central process that owns a lot of authority on the machine. For local development, I wanted less ambient privilege.
      </p>
      <p>
        Podman does not need that daemon. A container is launched as a process under the user who started it. In rootless mode, the container can think it is root internally while mapping back to an unprivileged user on the host. That does not make containers magically safe, but it does reduce the blast radius of a bad local setup.
      </p>
      <BlogCodeBlock
        filename="podman-basics.sh"
        code={`podman run --rm -it alpine sh
podman build -t local-app .
podman ps
podman generate systemd --name local-app --files`}
      />
      <h2 className={headingClass}>The migration was less dramatic than expected</h2>
      <p>
        Most commands transferred directly. Dockerfiles kept working. Image names kept working. The muscle memory stayed mostly intact. The places that needed attention were networking, compose workflows, and long-running services that I wanted systemd to manage.
      </p>
      <p>
        On NixOS, that last part became a benefit. Instead of relying on Docker restart policies, I could describe containers as services and let systemd handle lifecycle, logs, restart behavior, and boot-time startup. That made my development infrastructure feel like part of the system rather than a separate daemon world.
      </p>
      <h2 className={headingClass}>Where Podman is not a free win</h2>
      <p>
        Rootless networking can behave differently from Docker bridge networking. Some compose setups need small adjustments. A team already invested in Docker Desktop may not gain much by switching. I would not recommend changing tools just to feel more technically pure.
      </p>
      <p>
        For my own setup, the tradeoff was worth it. I wanted rootless containers, systemd-managed services, and a container workflow that matched a declarative Linux machine. Podman gave me that without forcing me to relearn everyday commands.
      </p>
    </>
  );
}

function MultilingualNextjsI18n() {
  return (
    <>
      <p>
        I built a multilingual Next.js site that needed English, French, and Swahili content without adding a large translation framework. The project was a corporate site, so the requirements were practical: clean URLs, translated metadata, stable navigation, and a content model that a small team could maintain.
      </p>
      <p>
        I chose a simple App Router pattern. Locale lives in the route. Middleware redirects users into the right locale. Server components load dictionaries. Components receive strings instead of reaching into global translation state.
      </p>
      <BlogFigure
        src="/images/blog/multilingual-nextjs-i18n.jpg"
        title="i18n"
        caption="The implementation used route segments, dictionaries, and middleware rather than a heavy translation dependency."
      />
      <h2 className={headingClass}>The route should tell you the language</h2>
      <p>
        I prefer URLs such as <code>/en/about</code>, <code>/fr/about</code>, and <code>/sw/about</code> because they are explicit. They work for sharing, indexing, analytics, and debugging. If a user sends a link, the recipient gets the same language. If search engines crawl the site, each locale has a stable location.
      </p>
      <p>
        Middleware handles the first visit. If the path has no locale, it checks the user’s language preference and redirects to a supported locale. After that, the URL carries the decision.
      </p>
      <BlogCodeBlock
        filename="locale-routing.ts"
        code={`const locales = ["en", "fr", "sw"] as const;

type Locale = (typeof locales)[number];

function hasLocale(pathname: string) {
  return locales.some((locale) => pathname.startsWith("/" + locale + "/") || pathname === "/" + locale);
}`}
      />
      <h2 className={headingClass}>Dictionaries kept the components simple</h2>
      <p>
        Each locale gets a dictionary file. Server components load the correct dictionary for the route and pass strings into presentational components. That kept the UI testable and avoided scattering translation lookups through every component.
      </p>
      <p>
        The tradeoff is discipline. Dictionary keys need naming conventions. Missing strings need fallbacks. Content editors need to understand that a structural change in one locale may need matching updates in the others. The simplicity is worth it only if the content model stays tidy.
      </p>
      <h2 className={headingClass}>What I would keep</h2>
      <p>
        I would keep the explicit locale routes, server-side dictionary loading, and small set of supported languages. I would add a stricter build-time check for missing dictionary keys if the site grew. For a corporate site with a manageable amount of content, this approach kept the code understandable and avoided a dependency that would have been larger than the problem.
      </p>
    </>
  );
}

function FromWslToNixos() {
  return (
    <>
      <p>
        WSL was my development environment for a long time. It gave me Linux tools without leaving Windows, and for web development that was enough. The problem was not one dramatic failure. It was drift: packages installed over months, config changes I could not fully reconstruct, and a setup that worked because I remembered its history.
      </p>
      <p>
        NixOS appealed to me because it changed the question. Instead of asking what I had installed, I could describe what the machine should be. The system configuration became a file I could read, version, and rebuild.
      </p>
      <BlogFigure
        src="/images/blog/from-wsl-to-nixos.webp"
        title="NixOS"
        caption="NixOS moved my development machine from accumulated state to declared state."
      />
      <h2 className={headingClass}>The old setup worked until I needed to reproduce it</h2>
      <p>
        WSL handled Node, Python, databases, and command-line tools well. The pain appeared when I wanted the same environment on another machine. I had notes, shell history, dotfiles, and memory, but not a complete system definition. That made every rebuild a small archaeology project.
      </p>
      <p>
        With NixOS, the machine is described through configuration. Packages, services, shells, fonts, systemd units, container tools, and environment settings can all live in the same version-controlled setup. A rebuild applies that state. A rollback returns to the previous generation.
      </p>
      <BlogCodeBlock
        filename="configuration.nix"
        code={`environment.systemPackages = with pkgs; [
  bun
  nodejs_22
  python312
  uv
  postgresql_16
  redis
  podman
  neovim
  ripgrep
];`}
      />
      <h2 className={headingClass}>The learning curve is real</h2>
      <p>
        Nix has its own language and its own way of thinking. Simple package installation is easy. Understanding overlays, derivations, modules, and evaluation takes time. The early phase is slower than using Ubuntu or Fedora because every unusual setup sends you into documentation and examples.
      </p>
      <p>
        The payoff is confidence. I can experiment with system changes and roll back. I can move a setup to another machine. I can inspect a commit and understand why a tool exists on the system. That has made my development environment calmer, not just more customizable.
      </p>
      <h2 className={headingClass}>Why I stayed</h2>
      <p>
        I stayed because the system fits how I already work. I like code review, versioned changes, reproducible builds, and explicit dependencies. NixOS applies that mindset to the machine itself. It is not the easiest Linux distribution to recommend broadly, but for my workflow it solved a real problem.
      </p>
    </>
  );
}

const registry: Record<string, () => React.JSX.Element> = {
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
