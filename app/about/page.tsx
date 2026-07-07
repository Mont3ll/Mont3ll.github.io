import { Arrow } from "@/components/ui/Arrow";
import { ViewTransitionLink } from "@/components/motion/ViewTransitionLink";

const facts = [
  ["Name", "Montell Luseno"],
  ["Location", "Nairobi, Kenya"],
  ["Focus", "Full-stack SaaS, AI products, and analytics"],
  ["Experience", "5+ years"],
  ["Email", "hello@mont3ll.dev"],
  ["Availability", "Open to new opportunities"],
];

export default function AboutPage() {
  return (
    <div className="grid gap-12 pb-24 pt-14 md:grid-cols-[0.48fr_0.52fr] md:pt-20">
      <div>
        <h1 className="text-[52px] tracking-[-0.07em] md:text-[70px]" style={{ viewTransitionName: "page-heading" }}>About me.</h1>
        <div className="mt-12 max-w-[480px] space-y-6 text-[16px] leading-7 text-black/75">
          <p>
            I&apos;m Montell, a software developer based in Nairobi, Kenya. I build full-stack
            web products that are fast, maintainable, and useful in real workflows.
          </p>
          <p>
            My work spans multi-tenant SaaS, learning platforms, marketplaces, scheduling
            tools, analytics-heavy dashboards, and open-source agent tooling. I care about
            clear data models, reliable access control, and interfaces that help people get work done.
          </p>
          <p>
            When I&apos;m not shipping products, I write about the technical choices behind the work,
            from declarative Linux setups to governed memory for AI coding agents.
          </p>
        </div>
        <ViewTransitionLink
          href="/contact"
          className="group mt-8 inline-block border-b border-black pb-2 text-[14px]"
        >
          Let&apos;s connect <Arrow />
        </ViewTransitionLink>
      </div>
      <div className="flex items-center">
        <div className="w-full max-w-[560px] space-y-0">
          {facts.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-[160px_1fr] border-b border-black/10 py-5 text-[15px]"
            >
              <span className="text-black/55">{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
