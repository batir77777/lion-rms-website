import type { Metadata } from "next";
import Link from "next/link";
import PhotoHero from "@/components/PhotoHero";
import { IMAGES } from "@/lib/site";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Examples of fire safety, health & safety, and digital compliance work delivered by Lion Risk Management Solutions for clients across East London.",
};

const CASES = [
  {
    sector: "Residential · Managing Agent",
    title: "Portfolio fire risk assessments",
    body: "Programme of Type 1 and Type 3 fire risk assessments across a residential block portfolio, with a prioritised remedial action schedule and clear duty-holder guidance.",
    tags: ["Fire Risk Assessment", "RRO 2005", "Action tracking"],
  },
  {
    sector: "Construction · Principal Contractor",
    title: "RAMS & construction phase plans",
    body: "Risk assessments, method statements, and construction phase plans developed alongside the project team to support a compliant, well-documented site setup.",
    tags: ["RAMS", "CDM", "H&S"],
  },
  {
    sector: "Property Management · Managing Agent",
    title: "Compliance platform for a property management company",
    body: "A bespoke digital compliance platform built for a property management company, centralising fire and health & safety inspections, certificates, and remedial actions into a single, auditable view across their managed portfolio.",
    tags: ["Digital Compliance", "Property Management", "Platform"],
  },
  {
    sector: "Professional Services · Consultancy",
    title: "Digital compliance solution for a consultancy",
    body: "A tailored compliance platform delivered for a consultancy firm, streamlining how assessments, records, and client deliverables are produced, tracked, and stored — improving consistency and turnaround while maintaining a clear audit trail.",
    tags: ["Digital Compliance", "Consultancy", "Automation"],
  },
  {
    sector: "Commercial · Multi-site Business",
    title: "Bespoke compliance dashboard",
    body: "A tailored digital portal centralising inspections, actions, and records across sites — giving the client real-time visibility of fire and health & safety compliance.",
    tags: ["Digital Compliance", "Dashboard", "Automation"],
  },
  {
    sector: "Mixed-use · Developer",
    title: "Fire strategy for change of use",
    body: "A bespoke fire strategy supporting a change-of-use planning application, setting out evacuation principles and construction details for Building Regulations compliance.",
    tags: ["Fire Strategy", "Building Regs", "Planning"],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <PhotoHero
        image={IMAGES.city}
        eyebrow="Case Studies"
        title="Trusted by clients across East London"
        body="A snapshot of the fire safety, health & safety, and digital compliance work we deliver. Client details are kept confidential; examples are representative of typical engagements."
      />
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {CASES.map((c, i) => (
              <Reveal key={c.title} delay={i * 70}>
                <article className="flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-7 shadow-sm transition hover:border-brand-200 hover:shadow-md">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">
                    {c.sector}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-ink-900">{c.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">
                    {c.body}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
            >
              Discuss your project
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
