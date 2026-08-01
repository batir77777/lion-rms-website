import type { Metadata } from "next";
import ComplianceCheck from "@/components/ComplianceCheck";
import Reveal from "@/components/Reveal";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { DEFAULT_OG_IMAGE } from "@/lib/content-jsonld";

export const metadata: Metadata = {
  title: "Free Compliance Self-Check — Fire & Health & Safety",
  description:
    "Ten yes/no questions covering your fire safety and health & safety duties. Get a red/amber/green score with a plain-English explanation of where you stand — free, no sign-up needed.",
  alternates: { canonical: "/check" },
  openGraph: {
    type: "website",
    title: "Free Compliance Self-Check — Fire & Health & Safety",
    description: "Ten yes/no questions covering your fire safety and health & safety duties. Get a red/amber/green score with a plain-English explanation of where you stand — free, no sign-up needed.",
    url: "/check",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function CheckPage() {
  return (
    <div className="bg-white">
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Compliance Self-Check" }]}
      />
      {/* White hero header — matches site style */}
      <div className="relative isolate overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-30"
            style={{ background: "radial-gradient(ellipse, rgba(14,165,160,0.15) 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-40 text-center sm:px-6">
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
              Free self-check
            </p>
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight text-navy-900">
              How exposed are you right now?
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-xl leading-relaxed text-slate-500">
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
