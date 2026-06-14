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
    <div className="bg-white">
      {/* White hero header — matches site style */}
      <div className="relative isolate overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-30"
            style={{ background: "radial-gradient(ellipse, rgba(14,165,160,0.15) 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-36 text-center sm:px-6 sm:pt-44">
          <Reveal>
            <p className="mb-4 inline-block rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-600">
              Free self-check
            </p>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-5xl">
              How exposed are you right now?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500">
              Ten honest yes/no questions across your fire and health &amp; safety
              duties. Your score is shown instantly — no sign-up, no email required.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Compliance quiz widget */}
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <Reveal delay={120}>
          <ComplianceCheck />
        </Reveal>
      </div>
    </div>
  );
}
