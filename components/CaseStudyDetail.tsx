import Link from "next/link";
import Reveal from "@/components/Reveal";
import RelatedContent from "@/components/RelatedContent";
import TestimonialGrid from "@/components/TestimonialGrid";
import type { CaseStudy } from "@/lib/case-studies";
import { getSector, getCategory, CTA_PRIMARY_LABEL, CTA_SECONDARY_LABEL, CTA_SECONDARY_HREF } from "@/lib/site";
import { getPost } from "@/lib/insights";

function KeyFactsPanel({ facts }: { facts: CaseStudy["keyFacts"] }) {
  const rows: Array<[string, string]> = [
    ["Sector", facts.sector],
    ["Building type", facts.buildingType],
    ["Location", facts.location],
    ["Service provided", facts.serviceProvided],
    ["Project type", facts.projectType],
    ["Risk profile", facts.riskLevel],
    ["Year", facts.yearCompleted],
  ];
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-7">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">Key facts</p>
      <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</dt>
            <dd className="mt-1 text-sm font-medium text-navy-900">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-navy-900">{title}</h2>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-base leading-relaxed text-slate-600">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-500" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CaseStudyDetail({ study }: { study: CaseStudy }) {
  // Only sectors with a live page (`hasPage: true`) get a href — the rest
  // still show as plain text (see RelatedContent) rather than linking to a
  // sector route that doesn't exist yet. Mirrors the same hasPage guard
  // already used for the sector grid on the homepage and /sectors index.
  const relatedSectorItems = study.relatedSectors
    .map((slug) => getSector(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ label: s.title, href: s.hasPage ? `/sectors/${s.slug}` : undefined }));

  const relatedServiceItems = study.relatedServices
    .map((slug) => getCategory(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => ({ label: c.title, href: `/services/${c.slug}` }));

  const relatedInsightItems = (study.relatedInsightSlugs ?? [])
    .map((slug) => getPost(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ label: p.title, href: `/insights/${p.slug}` }));

  return (
    <>
    <section className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <KeyFactsPanel facts={study.keyFacts} />
        </Reveal>

        <div className="mt-12 space-y-12">
          <Reveal>
            <div>
              <h2 className="mb-4 text-xl font-bold text-navy-900">Overview</h2>
              <p className="text-base leading-relaxed text-slate-600">{study.overview}</p>
            </div>
          </Reveal>

          <Reveal>
            <ListSection title="Scope of work" items={study.scopeOfWork} />
          </Reveal>

          <Reveal>
            <ListSection title="Challenges identified" items={study.challenges} />
          </Reveal>

          <Reveal>
            <ListSection title="Recommendations delivered" items={study.recommendations} />
          </Reveal>

          <Reveal>
            <div>
              <h2 className="mb-4 text-xl font-bold text-navy-900">Outcome</h2>
              <p className="text-base leading-relaxed text-slate-600">{study.outcome}</p>
            </div>
          </Reveal>
        </div>

        <RelatedContent
          groups={[
            { heading: "Related services", items: relatedServiceItems },
            { heading: "Related sectors", items: relatedSectorItems },
            { heading: "Related insights", items: relatedInsightItems },
          ]}
        />
      </div>
    </section>

    <TestimonialGrid />

    <section className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div
            className="rounded-2xl border p-10 text-center"
            style={{
              background: "linear-gradient(135deg,#060e1f 0%,#0c1f3f 50%,#082218 100%)",
              borderColor: "rgba(14,165,160,0.2)",
            }}
          >
            <h2 className="mb-4 text-2xl font-extrabold text-white">
              Facing something similar?
            </h2>
            <p className="mx-auto mb-7 max-w-xl text-base text-slate-400 leading-relaxed">
              Get in touch to discuss how we can support fire safety and compliance for your premises or project.
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

        <p className="mt-8 text-center text-sm">
          <Link href="/case-studies" className="font-semibold text-teal-700 hover:underline">
            ← All case studies
          </Link>
        </p>
      </div>
    </section>
    </>
  );
}
