import { RotatingBuildLine } from "@/components/motion/RotatingBuildLine";
import { Arrow } from "@/components/ui/Arrow";
import { ContactLine } from "@/components/ui/ContactLine";

export default function ContactPage() {
  return (
    <div className="pb-24 pt-14 md:pt-20">
      <div className="w-full">
        <h1 className="max-w-[920px] text-[52px] leading-[1.02] tracking-[-0.07em] md:text-[70px]">
          <RotatingBuildLine />
        </h1>
        <p className="mt-5 max-w-[430px] text-[15px] leading-6 text-black/70">
          Have a project in mind or just want to say hi? Drop me a message.
        </p>
      </div>
      <div className="mt-8 grid gap-14 border-t border-black/10 pt-10 md:grid-cols-[0.36fr_0.64fr]">
        <div className="space-y-7 text-[15px]">
          <ContactLine label="Email" value="meluseno@gmail.com" href="mailto:meluseno@gmail.com" />
          <ContactLine
            label="LinkedIn"
            value="linkedin.com/in/montell-luseno"
            href="https://www.linkedin.com/in/montell-luseno"
          />
          <ContactLine
            label="GitHub"
            value="github.com/mont3ll"
            href="https://github.com/mont3ll"
          />
        </div>
        <form className="space-y-4">
          <input
            className="focus-field w-full rounded-sm border border-black/15 bg-transparent px-4 py-4 text-[15px] outline-none placeholder:text-black/35"
            placeholder="Name"
          />
          <input
            className="focus-field w-full rounded-sm border border-black/15 bg-transparent px-4 py-4 text-[15px] outline-none placeholder:text-black/35"
            placeholder="Email"
          />
          <textarea
            rows={6}
            className="focus-field w-full rounded-sm border border-black/15 bg-transparent px-4 py-4 text-[15px] outline-none placeholder:text-black/35"
            placeholder="Message"
          />
          <button
            type="button"
            className="soft-button group rounded-sm bg-black px-5 py-4 text-[15px] text-white"
          >
            Send message <Arrow />
          </button>
        </form>
      </div>
    </div>
  );
}
