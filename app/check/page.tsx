import type { Metadata } from "next";
import ComplianceCheck from "@/components/ComplianceCheck";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Free Compliance Self-Check — Fire & Health & Safety",
  description:
    "Ten yes/no questions covering your fire safety and health & safety duties. Get a red/amber/green score with a plain-English explanation of where you stand — free, no sign-up needed.",
};

export default function CheckPage() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-ink-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 20% 0%, rgba(46, 42, 36, 0.5) 0%, transparent 60%)," +
            "radial-gradient(55% 45% at 85% 100%, rgba(194, 75, 8, 0.12) 0%, transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-36 sm:px-6">
        <Reveal>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-400">
              Free self-check
            </p>
            <h1 className="text-3xl font-bold text-white sm:text-5xl">
              How exposed are you right now?
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-300">
              Ten honest yes/no questions across your fire and health &amp;
              safety duties. Your score is shown instantly — no sign-up, no
              email required.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <ComplianceCheck />
        </Reveal>
      </div>
    </section>
  );
}
