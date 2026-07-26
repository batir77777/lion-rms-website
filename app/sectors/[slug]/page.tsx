import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PhotoHero from "@/components/PhotoHero";
import Reveal from "@/components/Reveal";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ServiceCheckCTA from "@/components/ServiceCheckCTA";
import ProcessTimeline from "@/components/ProcessTimeline";
import {
  SECTORS,
  SITE,
  SITE_URL,
  getSector,
  getCategory,
  COVERAGE_COUNTIES,
  CTA_PRIMARY_LABEL,
  CTA_SECONDARY_LABEL,
  CTA_SECONDARY_HREF,
} from "@/lib/site";

export function generateStaticParams() {
  return SECTORS.filter((s) => s.hasPage).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSector(slug);
  if (!sector || !sector.hasPage) return { title: "Sector" };
  return {
    title: sector.title,
    description: sector.body ?? sector.summary,
    alternates: { canonical: `/sectors/${slug}` },
  };
}

export default async function SectorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sector = getSector(slug);
  if (!sector || !sector.hasPage) notFound();

  const relatedCategories = (sector.relatedServices ?? [])
    .map((s) => getCategory(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${sector.title} — Fire & Health & Safety Consultancy`,
    description: sector.body ?? sector.summary,
    serviceType: relatedCategories.map((c) => c.title),
    url: `${SITE_URL}/sectors/${sector.slug}`,
    provider: {
      "@type": "ProfessionalService",
      name: SITE.name,
      url: SITE_URL,
    },
    areaServed: [
      { "@type": "City", name: "London" },
      ...COVERAGE_COUNTIES.map((c) => ({ "@type": "AdministrativeArea", name: c })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Sectors", path: "/sectors" },
          { name: sector.title },
        ]}
      />
      <PhotoHero eyebrow={sector.title} title={sector.title} body={sector.body ?? sector.summary} />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">

          {/* Key considerations */}
          {sector.considerations && sector.considerations.length > 0 && (
            <>
              <Reveal>
                <h2 className="mb-6 text-xl font-bold text-navy-900">Key considerations</h2>
              </Reveal>
              <div className="grid gap-5 sm:grid-cols-2">
                {sector.considerations.map((c, i) => (
                  <Reveal key={c} delay={i * 50}>
                    <div className="flex h-full items-start gap-3 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-600">
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-slate-600">{c}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          )}

          {/* Related services */}
          {relatedCategories.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-8">
              <p className="text-sm font-medium text-slate-400">Relevant services:</p>
              {relatedCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/services/${c.slug}`}
                  className="rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-sm font-semibold text-teal-700 transition hover:bg-teal-100"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          )}

          {/* Compliance Check promo */}
          <div className="mt-12">
            <ServiceCheckCTA />
          </div>

          {/* Consultation CTA */}
          <Reveal>
            <div
              className="mt-10 rounded-2xl border p-10 text-center"
              style={{
                background: "linear-gradient(135deg,#060e1f 0%,#0c1f3f 50%,#082218 100%)",
                borderColor: "rgba(14,165,160,0.2)",
              }}
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-teal-400">
                Ongoing Compliance Support
              </p>
              <h2 className="mb-4 text-2xl font-extrabold text-white">
                Discuss your {sector.title.toLowerCase()} requirements
              </h2>
              <p className="mx-auto mb-7 max-w-xl text-base text-slate-400 leading-relaxed">
                Tell us about your premises or project and we&apos;ll recommend a
                proportionate, compliant way forward — backed by expert consultancy and
                ongoing compliance support.
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

      {/* Assessment Process — reused, unmodified component */}
      <ProcessTimeline />
    </>
  );
}
