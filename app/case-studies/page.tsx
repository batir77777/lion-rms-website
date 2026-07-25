import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Examples of fire safety, health & safety, and compliance platform work delivered by Lion RMS for clients across London.",
  alternates: { canonical: "/case-studies" },
};

const CASES = [
  {
    sector: "Residential · Managing Agent",
    title: "Portfolio fire risk assessments with live action dashboard",
    body: "Programme of Type 1 and Type 3 fire risk assessments across a residential block portfolio — findings fed directly into the Lion RMS platform, giving the client a live prioritised action schedule and audit-ready records.",
    tags: ["Fire Risk Assessment", "RRO 2005", "Action Tracking", "Dashboard"],
  },
  {
    sector: "Construction · Principal Contractor",
    title: "RAMS & construction phase plans",
    body: "Risk assessments, method statements, and construction phase plans developed alongside the project team to support a compliant, well-documented site setup — all stored and version-controlled in the compliance platform.",
    tags: ["RAMS", "CDM", "H&S", "Document Control"],
  },
  {
    sector: "Property Management · Managing Agent",
    title: "Compliance platform for a property management company",
    body: "A bespoke digital compliance platform built for a property management company, centralising fire and health & safety inspections, certificates, and remedial actions into a single, auditable view across their managed portfolio.",
    tags: ["Digital Compliance", "Property Management", "Platform"],
  },
  {
    sector: "Professional Services · Consultancy",
    title: "Digital compliance solution for a consultancy firm",
    body: "A tailored compliance platform streamlining how assessments, records, and client deliverables are produced, tracked, and stored — reducing admin time and improving audit readiness.",
    tags: ["Digital Compliance", "Consultancy", "Automation"],
  },
  {
    sector: "Commercial · Multi-site Business",
    title: "Bespoke compliance dashboard for multi-site portfolio",
    body: "A tailored digital portal centralising inspections, actions, and records across all sites — giving the client real-time visibility of fire and health & safety compliance with automated review reminders.",
    tags: ["Digital Compliance", "Dashboard", "Automation"],
  },
  {
    sector: "Mixed-use · Developer",
    title: "Fire strategy for change of use",
    body: "A bespoke fire strategy supporting a change-of-use planning application, setting out evacuation principles and construction details for Building Regulations compliance — unlocking planning approval without further queries.",
    tags: ["Fire Strategy", "Building Regs", "Planning"],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <PhotoHero
        eyebrow="Case Studies"
        title="Trusted by clients across London"
        body="A snapshot of the fire safety, health & safety, and digital compliance work we deliver — from individual assessments to full compliance platform deployments."
      />
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-7 md:grid-cols-2">
            {CASES.map((c, i) => (
              <Reveal key={c.title} delay={i * 60}>
                <article className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-xl">
                  <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-teal-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
                    {c.sector}
                  </p>
                  <h2 className="mb-4 text-xl font-bold text-navy-900 leading-snug">{c.title}</h2>
                  <p className="flex-1 text-base leading-relaxed text-slate-500">{c.body}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div
              className="mt-16 rounded-2xl border p-10 text-center"
              style={{
                background: "linear-gradient(135deg,#060e1f 0%,#0c1f3f 50%,#082218 100%)",
                borderColor: "rgba(14,165,160,0.2)",
              }}
            >
              <h2 className="mb-4 text-2xl font-extrabold text-white">
                Ready to manage your compliance better?
              </h2>
              <p className="mx-auto mb-7 max-w-xl text-base text-slate-400 leading-relaxed">
                Book a free demo to see how the Lion RMS platform can work for your portfolio.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-lg transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#0c1f3f,#0ea5a0)" }}
                >
                  Book a Free Demo →
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full border border-white/20 bg-white/8 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/15"
                >
                  Request a Consultation
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
