import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { CTA_PRIMARY_LABEL, CTA_SECONDARY_LABEL, CTA_SECONDARY_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Examples of fire safety, health & safety, and compliance management work delivered by Lion RMS for clients across London.",
  alternates: { canonical: "/case-studies" },
};

const CASES = [
  {
    sector: "Residential · Managing Agent",
    title: "Portfolio fire risk assessments with ongoing action tracking",
    body: "Programme of Type 1 and Type 3 fire risk assessments across a residential block portfolio — findings fed directly into an ongoing compliance record, giving the client a prioritised action schedule and audit-ready documentation.",
    tags: ["Fire Risk Assessment", "RRO 2005", "Action Tracking", "Audit-Ready Records"],
  },
  {
    sector: "Construction · Principal Contractor",
    title: "RAMS & construction phase plans",
    body: "Risk assessments, method statements, and construction phase plans developed alongside the project team to support a compliant, well-documented site setup — all properly recorded and version-controlled.",
    tags: ["RAMS", "CDM", "H&S", "Document Control"],
  },
  {
    sector: "Property Management · Managing Agent",
    title: "Ongoing compliance management for a property management company",
    body: "A bespoke compliance management service for a property management company, centralising fire and health & safety inspections, certificates, and remedial actions into a single, auditable record across their managed portfolio.",
    tags: ["Compliance Management", "Property Management", "Portfolio Oversight"],
  },
  {
    sector: "Professional Services · Consultancy",
    title: "Compliance management support for a consultancy firm",
    body: "A tailored compliance management service streamlining how assessments, records, and client deliverables are produced, tracked, and stored — reducing admin time and improving audit readiness.",
    tags: ["Compliance Management", "Consultancy", "Process Improvement"],
  },
  {
    sector: "Commercial · Multi-site Business",
    title: "Bespoke compliance management for a multi-site portfolio",
    body: "A tailored compliance management service centralising inspections, actions, and records across all sites — giving the client clear visibility of fire and health & safety compliance, with scheduled review reminders.",
    tags: ["Compliance Management", "Multi-site Portfolio", "Review Scheduling"],
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
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Case Studies" }]} />
      <PhotoHero
        eyebrow="Case Studies"
        title="Trusted by clients across London"
        body="A snapshot of the fire safety, health & safety, and compliance management work we deliver — from individual assessments to full ongoing compliance support."
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
                Get in touch to discuss how we can support compliance across your portfolio.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-lg transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#0c1f3f,#0ea5a0)" }}
                >
                  {CTA_PRIMARY_LABEL} &rarr;
                </Link>
                <Link
                  href={CTA_SECONDARY_HREF}
                  className="inline-flex items-center rounded-full border border-white/20 bg-white/8 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/15"
                >
                  {CTA_SECONDARY_LABEL}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
